package com.stockify.service;

import com.stockify.dto.ChatResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    private final com.stockify.repository.StockRepository stockRepository;

    public ChatService(com.stockify.repository.StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public ChatResponse getChatResponse(String userMessage, String contextSymbol) {
        String lowerMsg = userMessage.toLowerCase().trim();
        List<com.stockify.model.Stock> detectedStocks = findRelevantStocks(userMessage);
        
        String activeSymbol = null;
        if (!detectedStocks.isEmpty()) {
            activeSymbol = detectedStocks.get(0).getSymbol();
        } else if (contextSymbol != null && isFollowUp(lowerMsg)) {
            activeSymbol = contextSymbol;
        }

        // 1. DATA-DRIVEN STOCK RESPONSE (If stock active)
        if (activeSymbol != null) {
            com.stockify.model.Stock stock = stockRepository.findBySymbol(activeSymbol).orElse(null);
            if (stock != null) {
                return ChatResponse.builder()
                        .response(formatDataResponse(stock, lowerMsg))
                        .contextSymbol(activeSymbol)
                        .success(true)
                        .build();
            }
        }

        // 2. RULE-BASED HANDLING (Keywords & Concepts)
        String ruleResponse = getRuleBasedResponse(lowerMsg);
        if (ruleResponse != null) {
            return ChatResponse.builder()
                    .response(ruleResponse)
                    .contextSymbol(contextSymbol)
                    .success(true)
                    .build();
        }

        // 3. STRICT FALLBACK (No Generic Replies)
        return ChatResponse.builder()
                .response("Stock not available in database")
                .success(true)
                .build();
    }

    private boolean isFollowUp(String msg) {
        return msg.contains("price") || msg.contains("trend") || msg.contains("analysis");
    }

    private String formatDataResponse(com.stockify.model.Stock s, String msg) {
        double change = s.getDayChangePercent() != null ? s.getDayChangePercent().doubleValue() : 0.0;
        String changeStr = change > 0 ? "+" + String.format("%.2f", change) + "%" : String.format("%.2f", change) + "%";
        String trend = change >= 0 ? "Upward" : "Downward";
        
        // Exact intent matching
        if (msg.contains("price") && !msg.contains("trend") && !msg.contains("analysis")) {
            return String.format("**%s**:\nPrice: ₹%s", s.getCompanyName(), s.getCurrentPrice());
        }
        
        if (msg.contains("trend") && !msg.contains("price") && !msg.contains("analysis")) {
            return String.format("**%s**:\nTrend: %s\nChange: %s", s.getCompanyName(), trend, changeStr);
        }

        // Default to Analysis format
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("**%s**:\n", s.getCompanyName()));
        sb.append(String.format("Price: ₹%s\n", s.getCurrentPrice()));
        sb.append(String.format("Change: %s\n", changeStr));
        sb.append(String.format("Trend: %s\n", trend));
        
        if (s.getMetrics() != null && s.getMetrics().getPeRatio() != null) {
            sb.append(String.format("PE Ratio: %.2f\n", s.getMetrics().getPeRatio()));
        }
        if (s.getMetrics() != null && s.getMetrics().getEps() != null) {
            sb.append(String.format("EPS: ₹%.2f\n", s.getMetrics().getEps()));
        }
        
        return sb.toString();
    }

    private String getRuleBasedResponse(String msg) {
        if (msg.contains("pe ratio") || msg.contains("eps")) {
            return "**PE Ratio vs EPS**:\n- **P/E Ratio** compares the stock price to its earnings. High P/E can mean the stock is expensive.\n- **EPS (Earnings Per Share)** is the profit a company makes for each share. Higher EPS is generally better.";
        }
        if (msg.contains("buy") && (msg.contains("bank") || msg.contains("banking"))) {
            return "**Banking Sector Guidance**:\n- Banking stocks are currently sensitive to RBI interest rate decisions.\n- Look for banks with low NPA (Non-Performing Assets) and strong CASA ratios before investing.";
        }
        return null;
    }

    private List<com.stockify.model.Stock> findRelevantStocks(String message) {
        List<com.stockify.model.Stock> found = new ArrayList<>();
        String upperMsg = message.toUpperCase();
        List<com.stockify.model.Stock> allStocks = stockRepository.findAll();
        for (com.stockify.model.Stock s : allStocks) {
            String symbolBase = s.getSymbol().split("\\.")[0];
            if (upperMsg.contains(symbolBase) || upperMsg.contains(s.getCompanyName().toUpperCase())) {
                found.add(s);
                if (found.size() >= 1) break; 
            }
        }
        return found;
    }
}
