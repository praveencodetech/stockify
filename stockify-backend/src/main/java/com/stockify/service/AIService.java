package com.stockify.service;

import com.stockify.dto.PredictionResponse;
import com.stockify.dto.SentimentResponse;
import com.stockify.model.Stock;
import com.stockify.model.StockMetrics;
import com.stockify.repository.StockRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIService.class);

    private final WebClient webClient;
    private final StockRepository stockRepository;

    @Value("${app.ai.service-url}")
    private String aiServiceUrl;

    public AIService(WebClient.Builder webClientBuilder, StockRepository stockRepository) {
        this.webClient = webClientBuilder.build();
        this.stockRepository = stockRepository;
    }

    /**
     * Get AI prediction for a stock. Tries the Python ML service first,
     * falls back to rule-based analysis if the service is unavailable.
     */
    public PredictionResponse getPrediction(String symbol) {
        try {
            // Try calling the Python AI service
            PredictionResponse response = webClient.get()
                    .uri(aiServiceUrl + "/predict/" + symbol)
                    .retrieve()
                    .bodyToMono(PredictionResponse.class)
                    .block();

            if (response != null) {
                return response;
            }
        } catch (Exception e) {
            logger.warn("AI service unavailable, using rule-based analysis for {}: {}", symbol, e.getMessage());
        }

        // Fallback: rule-based fundamental analysis
        return generateRuleBasedPrediction(symbol);
    }

    /**
     * Get news sentiment analysis for a stock. Tries the Python sentiment service first,
     * falls back to mock sentiment data if unavailable.
     */
    public SentimentResponse getSentiment(String symbol) {
        try {
            SentimentResponse response = webClient.get()
                    .uri(aiServiceUrl + "/sentiment/" + symbol)
                    .retrieve()
                    .bodyToMono(SentimentResponse.class)
                    .block();

            if (response != null) {
                return response;
            }
        } catch (Exception e) {
            logger.warn("Sentiment service unavailable, using mock data for {}: {}", symbol, e.getMessage());
        }

        // Fallback: generate mock sentiment data
        return generateMockSentiment(symbol);
    }

    private PredictionResponse generateRuleBasedPrediction(String symbol) {
        Stock stock = stockRepository.findBySymbol(symbol.toUpperCase()).orElse(null);

        double currentPrice = stock != null && stock.getCurrentPrice() != null
                ? stock.getCurrentPrice().doubleValue() : 150.0;

        StockMetrics metrics = stock != null ? stock.getMetrics() : null;

        // Score-based analysis
        int score = 0;
        List<String> reasons = new ArrayList<>();

        if (metrics != null) {
            // P/E Ratio analysis
            if (metrics.getPeRatio() != null) {
                double pe = metrics.getPeRatio().doubleValue();
                if (pe > 0 && pe < 20) { score += 2; reasons.add("Attractive P/E ratio (" + pe + ") suggests good value"); }
                else if (pe >= 20 && pe < 35) { score += 1; reasons.add("Fair P/E ratio (" + pe + ")"); }
                else if (pe >= 35) { score -= 1; reasons.add("High P/E ratio (" + pe + ") indicates premium valuation"); }
            }

            // EPS analysis
            if (metrics.getEps() != null) {
                double eps = metrics.getEps().doubleValue();
                if (eps > 5) { score += 2; reasons.add("Strong earnings per share (₹" + eps + ")"); }
                else if (eps > 0) { score += 1; reasons.add("Positive earnings (₹" + eps + " per share)"); }
                else { score -= 1; reasons.add("Negative earnings — company is not currently profitable"); }
            }

            // Revenue Growth
            if (metrics.getRevenueGrowth() != null) {
                double growth = metrics.getRevenueGrowth().doubleValue() * 100;
                if (growth > 15) { score += 2; reasons.add("Excellent revenue growth (" + String.format("%.1f", growth) + "%)"); }
                else if (growth > 5) { score += 1; reasons.add("Healthy revenue growth (" + String.format("%.1f", growth) + "%)"); }
                else if (growth < 0) { score -= 2; reasons.add("Revenue declining (" + String.format("%.1f", growth) + "%)"); }
            }

            // Debt-to-Equity
            if (metrics.getDebtToEquity() != null) {
                double dte = metrics.getDebtToEquity().doubleValue();
                if (dte < 0.5) { score += 1; reasons.add("Low debt levels (D/E: " + dte + ")"); }
                else if (dte > 2.0) { score -= 1; reasons.add("High debt levels (D/E: " + dte + ") — increased financial risk"); }
            }

            // ROE analysis
            if (metrics.getRoe() != null) {
                double roe = metrics.getRoe().doubleValue() * 100;
                if (roe > 20) { score += 1; reasons.add("Strong return on equity (" + String.format("%.1f", roe) + "%)"); }
                else if (roe < 5) { score -= 1; reasons.add("Weak return on equity (" + String.format("%.1f", roe) + "%)"); }
            }
        } else {
            reasons.add("Limited fundamental data available — analysis based on price trends");
        }

        // Day change analysis
        if (stock != null && stock.getDayChangePercent() != null) {
            double dayChange = stock.getDayChangePercent().doubleValue();
            if (dayChange > 2) { score += 1; reasons.add("Strong positive momentum today (+" + dayChange + "%)"); }
            else if (dayChange < -2) { score -= 1; reasons.add("Significant price decline today (" + dayChange + "%)"); }
        }

        // Determine recommendation
        String recommendation;
        String riskLevel;
        double confidence;

        if (score >= 4) {
            recommendation = "BUY";
            riskLevel = "LOW";
            confidence = Math.min(0.85, 0.6 + score * 0.05);
        } else if (score >= 1) {
            recommendation = "BUY";
            riskLevel = "MEDIUM";
            confidence = 0.55 + score * 0.05;
        } else if (score >= -1) {
            recommendation = "HOLD";
            riskLevel = "MEDIUM";
            confidence = 0.5 + Math.abs(score) * 0.05;
        } else {
            recommendation = "SELL";
            riskLevel = score < -3 ? "HIGH" : "MEDIUM";
            confidence = Math.min(0.8, 0.5 + Math.abs(score) * 0.05);
        }

        // Predict price change
        double predictedChangePercent = score * 1.5 + (new Random(symbol.hashCode()).nextDouble() - 0.3) * 5;
        double predictedPrice = currentPrice * (1 + predictedChangePercent / 100);

        return PredictionResponse.builder()
                .symbol(symbol.toUpperCase())
                .recommendation(recommendation)
                .confidence(Math.round(confidence * 100.0) / 100.0)
                .predictedPrice(Math.round(predictedPrice * 100.0) / 100.0)
                .currentPrice(currentPrice)
                .priceChangePercent(Math.round(predictedChangePercent * 100.0) / 100.0)
                .reasoning(String.join(". ", reasons) + ".")
                .riskLevel(riskLevel)
                .timeframe("MEDIUM_TERM")
                .build();
    }

    private SentimentResponse generateMockSentiment(String symbol) {
        Stock stock = stockRepository.findBySymbol(symbol.toUpperCase()).orElse(null);
        String companyName = stock != null ? stock.getCompanyName() : symbol;

        Random random = new Random(symbol.hashCode() + LocalDateTime.now().getDayOfYear());

        // Generate mock news articles
        String[][] newsTemplates = {
            {companyName + " Reports Strong Quarterly Earnings", "Reuters", "0.8"},
            {companyName + " Expands Into New Markets", "Bloomberg", "0.6"},
            {"Analysts Upgrade " + companyName + " Stock Rating", "CNBC", "0.7"},
            {companyName + " Faces Regulatory Challenges", "Wall Street Journal", "-0.3"},
            {"Market Volatility Impacts " + companyName + " Share Price", "Financial Times", "-0.2"},
            {companyName + " Announces New Product Launch", "TechCrunch", "0.5"},
            {"Investors Eye " + companyName + " Amid Market Rally", "MarketWatch", "0.4"},
            {companyName + " CEO Discusses Future Growth Strategy", "Forbes", "0.3"},
            {"Sector Headwinds Could Affect " + companyName, "Barrons", "-0.4"},
            {companyName + " Partners With Industry Leader", "Business Insider", "0.6"}
        };

        // Pick 5-7 random articles
        int numArticles = 5 + random.nextInt(3);
        List<Integer> indices = new ArrayList<>();
        for (int i = 0; i < newsTemplates.length; i++) indices.add(i);
        Collections.shuffle(indices, random);

        List<SentimentResponse.NewsItem> articles = new ArrayList<>();
        double sentimentSum = 0;

        for (int i = 0; i < Math.min(numArticles, newsTemplates.length); i++) {
            int idx = indices.get(i);
            double baseSentiment = Double.parseDouble(newsTemplates[idx][2]);
            double sentiment = baseSentiment + (random.nextDouble() - 0.5) * 0.2;
            sentiment = Math.max(-1.0, Math.min(1.0, sentiment));
            sentimentSum += sentiment;

            articles.add(SentimentResponse.NewsItem.builder()
                    .title(newsTemplates[idx][0])
                    .source(newsTemplates[idx][1])
                    .url("https://www.google.com/search?q=" + symbol + "+stock+market+news")
                    .sentiment(Math.round(sentiment * 100.0) / 100.0)
                    .sentimentLabel(getSentimentLabel(sentiment))
                    .publishedAt(LocalDateTime.now().minusHours(random.nextInt(72))
                            .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                    .build());
        }

        double overallSentiment = sentimentSum / articles.size();

        return SentimentResponse.builder()
                .symbol(symbol.toUpperCase())
                .overallSentiment(Math.round(overallSentiment * 100.0) / 100.0)
                .sentimentLabel(getSentimentLabel(overallSentiment))
                .totalArticles(articles.size())
                .articles(articles)
                .build();
    }

    private String getSentimentLabel(double sentiment) {
        if (sentiment >= 0.5) return "VERY_POSITIVE";
        if (sentiment >= 0.2) return "POSITIVE";
        if (sentiment >= -0.2) return "NEUTRAL";
        if (sentiment >= -0.5) return "NEGATIVE";
        return "VERY_NEGATIVE";
    }
}
