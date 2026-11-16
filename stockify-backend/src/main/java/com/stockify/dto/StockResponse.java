package com.stockify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockResponse {
    private Long id;
    private String symbol;
    private String companyName;
    private String sector;
    private String industry;
    private BigDecimal currentPrice;
    private BigDecimal previousClose;
    private BigDecimal dayChange;
    private BigDecimal dayChangePercent;
    private Long volume;

    // Fundamental Metrics
    private BigDecimal peRatio;
    private BigDecimal eps;
    private BigDecimal marketCap;
    private BigDecimal revenueGrowth;
    private BigDecimal debtToEquity;
    private BigDecimal dividendYield;
    private BigDecimal bookValue;
    private BigDecimal roe;
    private BigDecimal fiftyTwoWeekHigh;
    private BigDecimal fiftyTwoWeekLow;

    // Beginner-friendly explanations
    private String peRatioExplanation;
    private String epsExplanation;
    private String marketCapExplanation;
    private String revenueGrowthExplanation;
    private String debtToEquityExplanation;
}
