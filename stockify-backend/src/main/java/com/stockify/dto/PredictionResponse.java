package com.stockify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResponse {
    private String symbol;
    private String recommendation;     // BUY, HOLD, SELL
    private double confidence;          // 0.0 to 1.0
    private double predictedPrice;
    private double currentPrice;
    private double priceChangePercent;
    private String reasoning;
    private String riskLevel;           // LOW, MEDIUM, HIGH
    private String timeframe;           // SHORT_TERM, MEDIUM_TERM, LONG_TERM
}
