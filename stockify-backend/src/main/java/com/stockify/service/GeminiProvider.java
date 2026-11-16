package com.stockify.service;

import com.stockify.dto.AiMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GeminiProvider implements AiProvider {

    private static final Logger logger = LoggerFactory.getLogger(GeminiProvider.class);

    private final WebClient webClient;

    @Value("${app.gemini.key:MISSING}")
    private String apiKey;

    @Value("${app.gemini.model:gemini-2.0-flash}")
    private String model;

    public GeminiProvider(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com/v1beta").build();
    }

    @Override
    public String generateChatResponse(List<AiMessage> messages) {
        if ("MISSING".equals(apiKey) || apiKey.isEmpty()) {
            throw new RuntimeException("Gemini API key is missing");
        }

        try {
            // Convert our standard List<AiMessage> to Gemini's expected JSON format
            Map<String, Object> requestBody = new HashMap<>();

            // 1. Extract system instruction
            AiMessage systemMsg = messages.stream()
                    .filter(msg -> "system".equalsIgnoreCase(msg.getRole()))
                    .findFirst()
                    .orElse(null);

            if (systemMsg != null) {
                Map<String, Object> systemInstruction = new HashMap<>();
                systemInstruction.put("parts", List.of(Map.of("text", systemMsg.getContent())));
                requestBody.put("systemInstruction", systemInstruction);
            }

            // 2. Extract chat contents
            List<Map<String, Object>> contents = messages.stream()
                    .filter(msg -> !"system".equalsIgnoreCase(msg.getRole()))
                    .map(msg -> {
                        Map<String, Object> contentMap = new HashMap<>();
                        // Gemini expects 'user' or 'model' roles
                        String role = "assistant".equalsIgnoreCase(msg.getRole()) ? "model" : "user";
                        contentMap.put("role", role);
                        contentMap.put("parts", List.of(Map.of("text", msg.getContent())));
                        return contentMap;
                    })
                    .collect(Collectors.toList());

            requestBody.put("contents", contents);

            logger.info("Sending request to Gemini with model: {}", model);

            Map<String, Object> apiResponse = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/models/" + model + ":generateContent")
                            .queryParam("key", apiKey)
                            .build())
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (apiResponse != null && apiResponse.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) apiResponse.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> contentNode = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, String>> parts = (List<Map<String, String>>) contentNode.get("parts");
                    if (!parts.isEmpty()) {
                        return parts.get(0).get("text").trim();
                    }
                }
            }

            throw new RuntimeException("Received an unexpected format from Gemini");

        } catch (WebClientResponseException e) {
            logger.error("Gemini API Error ({}): {}. Body: {}", e.getStatusCode(), e.getMessage(), e.getResponseBodyAsString());
            throw new RuntimeException("Gemini API Error: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error calling Gemini: {}", e.getMessage());
            throw new RuntimeException("Unexpected error calling Gemini: " + e.getMessage());
        }
    }
}
