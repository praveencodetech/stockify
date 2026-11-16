package com.stockify.repository;

import com.stockify.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findBySymbol(String symbol);

    @Query("SELECT s FROM Stock s WHERE LOWER(s.symbol) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.companyName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.sector) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Stock> searchStocks(@Param("query") String query);

    List<Stock> findBySectorIgnoreCase(String sector);

    @Query("SELECT DISTINCT s.sector FROM Stock s WHERE s.sector IS NOT NULL")
    List<String> findAllSectors();
}
