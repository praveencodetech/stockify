package com.stockify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveStockData {
    private String symbol;
    private BigDecimal currentPrice;
    private BigDecimal previousClose;
    private BigDecimal dayChange;
    private BigDecimal dayChangePercent;
    private Long volume;
    private String lastUpdated;
    
    // Fundamental metrics
    private BigDecimal fiftyTwoWeekHigh;
    private BigDecimal fiftyTwoWeekLow;
    private BigDecimal marketCap;
    private BigDecimal peRatio;
    private BigDecimal eps;
}
