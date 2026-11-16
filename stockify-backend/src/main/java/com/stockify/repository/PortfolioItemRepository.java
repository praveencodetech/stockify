package com.stockify.repository;

import com.stockify.model.PortfolioItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PortfolioItemRepository extends JpaRepository<PortfolioItem, Long> {
    List<PortfolioItem> findByUserId(Long userId);
    List<PortfolioItem> findByUserIdAndStockId(Long userId, Long stockId);
    void deleteByIdAndUserId(Long id, Long userId);
}
