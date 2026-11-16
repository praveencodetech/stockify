package com.stockify.repository;

import com.stockify.model.StockHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface StockHistoryRepository extends JpaRepository<StockHistory, Long> {
    List<StockHistory> findByStockIdOrderByDateDesc(Long stockId);
    List<StockHistory> findByStockSymbolOrderByDateDesc(String symbol);
    List<StockHistory> findByStockIdAndDateBetweenOrderByDateAsc(Long stockId, LocalDate start, LocalDate end);
    List<StockHistory> findByStockSymbolAndDateBetweenOrderByDateAsc(String symbol, LocalDate start, LocalDate end);
}
