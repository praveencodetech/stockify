package com.stockify.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stocks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String symbol;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    private String sector;
    private String industry;

    @Column(name = "current_price", precision = 12, scale = 2)
    private BigDecimal currentPrice;

    @Column(name = "previous_close", precision = 12, scale = 2)
    private BigDecimal previousClose;

    @Column(name = "day_change", precision = 12, scale = 2)
    private BigDecimal dayChange;

    @Column(name = "day_change_percent", precision = 8, scale = 4)
    private BigDecimal dayChangePercent;

    private Long volume;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @OneToOne(mappedBy = "stock", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private StockMetrics metrics;
}
