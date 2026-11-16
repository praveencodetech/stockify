package com.stockify.repository;

import com.stockify.model.StockMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StockMetricsRepository extends JpaRepository<StockMetrics, Long> {
    Optional<StockMetrics> findByStockId(Long stockId);
    Optional<StockMetrics> findByStockSymbol(String symbol);
}
