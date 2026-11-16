package com.stockify.service;

import com.stockify.dto.PortfolioRequest;
import com.stockify.model.PortfolioItem;
import com.stockify.model.Stock;
import com.stockify.model.User;
import com.stockify.repository.PortfolioItemRepository;
import com.stockify.repository.StockRepository;
import com.stockify.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PortfolioService {

    private final PortfolioItemRepository portfolioItemRepository;
    private final StockRepository stockRepository;
    private final UserRepository userRepository;

    public PortfolioService(PortfolioItemRepository portfolioItemRepository,
                            StockRepository stockRepository,
                            UserRepository userRepository) {
        this.portfolioItemRepository = portfolioItemRepository;
        this.stockRepository = stockRepository;
        this.userRepository = userRepository;
    }

    public List<PortfolioItem> getUserPortfolio(Long userId) {
        return portfolioItemRepository.findByUserId(userId);
    }

    public PortfolioItem addToPortfolio(Long userId, PortfolioRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Stock stock = stockRepository.findBySymbol(request.getSymbol().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Stock not found: " + request.getSymbol()));

        PortfolioItem item = PortfolioItem.builder()
                .user(user)
                .stock(stock)
                .quantity(request.getQuantity())
                .buyPrice(request.getBuyPrice())
                .buyDate(request.getBuyDate())
                .notes(request.getNotes())
                .build();

        return portfolioItemRepository.save(item);
    }

    @Transactional
    public void removeFromPortfolio(Long userId, Long itemId) {
        portfolioItemRepository.deleteByIdAndUserId(itemId, userId);
    }

    public Map<String, Object> getPortfolioSummary(Long userId) {
        List<PortfolioItem> items = portfolioItemRepository.findByUserId(userId);

        BigDecimal totalInvested = BigDecimal.ZERO;
        BigDecimal totalCurrentValue = BigDecimal.ZERO;

        for (PortfolioItem item : items) {
            BigDecimal invested = item.getBuyPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalInvested = totalInvested.add(invested);

            Stock stock = item.getStock();
            if (stock != null && stock.getCurrentPrice() != null) {
                BigDecimal currentValue = stock.getCurrentPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                totalCurrentValue = totalCurrentValue.add(currentValue);
            }
        }

        BigDecimal totalPnL = totalCurrentValue.subtract(totalInvested);
        BigDecimal pnlPercent = totalInvested.compareTo(BigDecimal.ZERO) > 0
                ? totalPnL.divide(totalInvested, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalItems", items.size());
        summary.put("totalInvested", totalInvested.setScale(2, RoundingMode.HALF_UP));
        summary.put("totalCurrentValue", totalCurrentValue.setScale(2, RoundingMode.HALF_UP));
        summary.put("totalPnL", totalPnL.setScale(2, RoundingMode.HALF_UP));
        summary.put("pnlPercent", pnlPercent.setScale(2, RoundingMode.HALF_UP));
        summary.put("items", items);

        return summary;
    }
}
