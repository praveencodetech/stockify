package com.stockify.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    @JsonIgnore
    private Stock stock;

    @Column(name = "pe_ratio", precision = 10, scale = 2)
    private BigDecimal peRatio;

    @Column(precision = 10, scale = 2)
    private BigDecimal eps;

    @Column(name = "market_cap", precision = 20, scale = 2)
    private BigDecimal marketCap;

    @Column(name = "revenue_growth", precision = 8, scale = 4)
    private BigDecimal revenueGrowth;

    @Column(name = "debt_to_equity", precision = 10, scale = 4)
    private BigDecimal debtToEquity;

    @Column(name = "dividend_yield", precision = 8, scale = 4)
    private BigDecimal dividendYield;

    @Column(name = "book_value", precision = 12, scale = 2)
    private BigDecimal bookValue;

    @Column(precision = 8, scale = 4)
    private BigDecimal roe;

    @Column(name = "fifty_two_week_high", precision = 12, scale = 2)
    private BigDecimal fiftyTwoWeekHigh;

    @Column(name = "fifty_two_week_low", precision = 12, scale = 2)
    private BigDecimal fiftyTwoWeekLow;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
