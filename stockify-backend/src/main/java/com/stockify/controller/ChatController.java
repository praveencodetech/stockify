package com.stockify.controller;

import com.stockify.dto.StockResponse;
import com.stockify.service.StockService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private static final List<String> STOP_WORDS = Arrays.asList("ltd", "limited", "india", "company", "corp");

    @Autowired
    private StockService stockService;

    private final Map<String, StockResponse> stockCache = new ConcurrentHashMap<>();
    private List<StockResponse> cachedStocks = new ArrayList<>();

    @PostConstruct
    public void init() {
        try {
            cachedStocks = stockService.getAllStocks();
        } catch (Exception e) {
            cachedStocks = new ArrayList<>();
        }
    }

    @Scheduled(fixedRate = 600000)
    public void refreshCache() {
        try {
            cachedStocks = stockService.getAllStocks();
            stockCache.clear();
        } catch (Exception e) {
            // Retain old cache if refresh fails
        }
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        try {
            String message = request.getMessage();
            if (message == null || message.trim().isEmpty()) {
                return new ChatResponse("I'm not sure, but I can help with stock prices, trends, and analysis. Try asking about TCS, Infosys, or Reliance.");
            }

            String lowerMsg = message.toLowerCase().trim();

            // General Queries
            if (lowerMsg.contains("rsi")) {
                return new ChatResponse("RSI (Relative Strength Index) is a momentum indicator that measures the magnitude of recent price changes to evaluate overbought or oversold conditions.");
            }
            if (lowerMsg.contains("sector")) {
                return new ChatResponse("Currently, IT, Banking, and Renewable Energy are among the top performing sectors to watch.");
            }
            if (lowerMsg.contains("mutual fund") || lowerMsg.contains("best fund")) {
                return new ChatResponse("Nippon India Small Cap Fund and Quant Tax Plan have shown excellent historical returns. For lower risk, consider ICICI Prudential Bluechip Fund.");
            }
            if (lowerMsg.contains("explain pe ratio") || (lowerMsg.contains("what is") && lowerMsg.contains("pe ratio"))) {
                return new ChatResponse("P/E Ratio (Price-to-Earnings) compares a company's share price to its earnings per share. A high P/E could mean the stock is overvalued, or investors expect high growth.");
            }

            // Clean user input: remove special characters before matching
            lowerMsg = lowerMsg.replaceAll("[^a-zA-Z0-9 ]", "");

            // Stock Matching Logic
            for (StockResponse stock : cachedStocks) {
                String symbol = stock.getSymbol();
                String company = stock.getCompanyName();

                if (symbol == null || company == null) continue;

                String symbolLower = symbol.toLowerCase().replaceAll("[^a-zA-Z0-9 ]", "");
                String companyLower = company.toLowerCase().replaceAll("[^a-zA-Z0-9 ]", "");
                String symbolBase = symbol.toLowerCase().contains(".")
                        ? symbol.toLowerCase().split("\\.")[0]
                        : symbol.toLowerCase();

                boolean isMatch = false;

                // Step 1: Symbol exact match
                if (lowerMsg.contains(symbolLower)) {
                    isMatch = true;
                }
                // Step 2: Base symbol match (without .NS / .BO suffix)
                else if (!symbolBase.isEmpty() && lowerMsg.contains(symbolBase)) {
                    isMatch = true;
                }
                // Step 3: Full company name match
                else if (lowerMsg.contains(companyLower)) {
                    isMatch = true;
                }
                // Step 4: Partial word match (skip stop words and short words)
                else {
                    String[] words = companyLower.split("\\s+");
                    for (String word : words) {
                        if (word.length() > 3 && !STOP_WORDS.contains(word) && lowerMsg.contains(word)) {
                            isMatch = true;
                            break;
                        }
                    }
                }

                if (isMatch) {
                    System.out.println("[ChatBot] User Input: " + lowerMsg);
                    System.out.println("[ChatBot] Matched Stock Symbol: " + stock.getSymbol());

                    StockResponse currentStock = stockCache.get(stock.getSymbol());

                    if (currentStock == null) {
                        // Primary fetch: try the full symbol as stored
                        try {
                            currentStock = stockService.getStockBySymbol(stock.getSymbol());
                            if (currentStock != null) {
                                stockCache.put(stock.getSymbol(), currentStock);
                            }
                        } catch (Exception e) {
                            System.out.println("[ChatBot] Primary fetch failed for '" + stock.getSymbol() + "': " + e.getMessage());
                            e.printStackTrace();
                        }

                        // Fallback: strip exchange suffix (.NS, .BO, etc.) and retry
                        if (currentStock == null && stock.getSymbol().contains(".")) {
                            String baseSymbol = stock.getSymbol().split("\\.")[0];
                            System.out.println("[ChatBot] Trying base symbol fallback: " + baseSymbol);
                            try {
                                currentStock = stockService.getStockBySymbol(baseSymbol);
                                if (currentStock != null) {
                                    stockCache.put(stock.getSymbol(), currentStock);
                                }
                            } catch (Exception e) {
                                System.out.println("[ChatBot] Fallback fetch also failed for '" + baseSymbol + "': " + e.getMessage());
                                e.printStackTrace();
                            }
                        }
                    }

                    if (currentStock == null || currentStock.getCurrentPrice() == null) {
                        return new ChatResponse("Stock found but detailed data not available.");
                    }

                    if (lowerMsg.contains("price")) {
                        return new ChatResponse("The current price of " + currentStock.getCompanyName() + " is ₹" + currentStock.getCurrentPrice() + ".");
                    }
                    if (lowerMsg.contains("trend") || lowerMsg.contains("change")) {
                        String trend = (currentStock.getDayChange() != null && currentStock.getDayChange().doubleValue() >= 0) ? "upward" : "downward";
                        String changePercent = currentStock.getDayChangePercent() != null ? currentStock.getDayChangePercent().toString() : "0.0";
                        return new ChatResponse("The trend for " + currentStock.getCompanyName() + " is " + trend + " with a change of " + changePercent + "% today.");
                    }
                    if (lowerMsg.contains("pe ratio") || lowerMsg.contains("p/e")) {
                        String pe = currentStock.getPeRatio() != null ? currentStock.getPeRatio().toString() : "N/A";
                        return new ChatResponse(currentStock.getCompanyName() + " has a P/E ratio of " + pe + ".");
                    }
                    if (lowerMsg.contains("eps")) {
                        String eps = currentStock.getEps() != null ? currentStock.getEps().toString() : "N/A";
                        return new ChatResponse(currentStock.getCompanyName() + " has an EPS of ₹" + eps + ".");
                    }

                    return new ChatResponse(currentStock.getCompanyName() + " (" + currentStock.getSymbol() + ") is currently trading at ₹" + currentStock.getCurrentPrice() + ".");
                }
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ChatResponse("I'm not sure, but I can help with stock prices, trends, and analysis. Try asking about TCS, Infosys, or Reliance.");
    }

    public static class ChatRequest {
        private String message;
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class ChatResponse {
        private String reply;
        public ChatResponse() {}
        public ChatResponse(String reply) { this.reply = reply; }
        public String getReply() { return reply; }
        public void setReply(String reply) { this.reply = reply; }
    }
}
