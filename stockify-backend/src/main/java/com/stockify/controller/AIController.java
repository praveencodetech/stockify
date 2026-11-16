package com.stockify.controller;

import com.stockify.dto.PredictionResponse;
import com.stockify.dto.SentimentResponse;
import com.stockify.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/predict/{symbol:.+}")
    public ResponseEntity<PredictionResponse> getPrediction(@PathVariable String symbol) {
        return ResponseEntity.ok(aiService.getPrediction(symbol));
    }

    @GetMapping("/sentiment/{symbol:.+}")
    public ResponseEntity<SentimentResponse> getSentiment(@PathVariable String symbol) {
        return ResponseEntity.ok(aiService.getSentiment(symbol));
    }
}
