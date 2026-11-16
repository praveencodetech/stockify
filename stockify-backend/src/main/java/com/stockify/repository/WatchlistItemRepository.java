package com.stockify.repository;

import com.stockify.model.WatchlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WatchlistItemRepository extends JpaRepository<WatchlistItem, Long> {
    List<WatchlistItem> findByUserId(Long userId);
    Optional<WatchlistItem> findByUserIdAndStockId(Long userId, Long stockId);
    boolean existsByUserIdAndStockId(Long userId, Long stockId);
    void deleteByUserIdAndStockId(Long userId, Long stockId);
}
