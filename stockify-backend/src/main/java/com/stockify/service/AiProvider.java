package com.stockify.service;

import com.stockify.dto.AiMessage;
import java.util.List;

public interface AiProvider {
    /**
     * Generates a chat response given a list of messages.
     * This follows an OpenAI-like structure to easily swap providers later.
     *
     * @param messages List of System, User, and Assistant messages.
     * @return The text response from the AI.
     */
    String generateChatResponse(List<AiMessage> messages);
}
