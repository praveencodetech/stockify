package com.stockify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiMessage {
    private String role;     // e.g., "system", "user", "assistant"
    private String content;  // the actual message content
}
