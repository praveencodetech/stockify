package com.stockify.service;

import com.stockify.dto.SentimentResponse;
import com.stockify.model.PortfolioItem;
import com.stockify.model.User;
import com.stockify.model.WatchlistItem;
import com.stockify.repository.PortfolioItemRepository;
import com.stockify.repository.UserRepository;
import com.stockify.repository.WatchlistItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class NewsNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NewsNotificationService.class);

    private final UserRepository userRepository;
    private final WatchlistItemRepository watchlistItemRepository;
    private final PortfolioItemRepository portfolioItemRepository;
    private final AIService aiService;
    private final EmailService emailService;

    // Track URLs we have already sent to users so we only send *new* news
    // Format: "userId:articleUrl" -> Avoid sending the same article twice
    private final Set<String> processedNews = new HashSet<>();

    public NewsNotificationService(
            UserRepository userRepository,
            WatchlistItemRepository watchlistItemRepository,
            PortfolioItemRepository portfolioItemRepository,
            AIService aiService,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.watchlistItemRepository = watchlistItemRepository;
        this.portfolioItemRepository = portfolioItemRepository;
        this.aiService = aiService;
        this.emailService = emailService;
    }

    /**
     * Checks for new news articles for each user's tracked stocks
     * Runs every 2 minutes (120,000 ms)
     */
    @Scheduled(fixedRate = 120000)
    public void checkForNewsUpdates() {
        logger.info("Starting background market news check...");
        List<User> users = userRepository.findAll();

        for (User user : users) {
             processUserNews(user);
        }
        logger.info("Finished background market news check.");
    }

    private void processUserNews(User user) {
        // Collect symbols user cares about
        Set<String> trackedSymbols = new HashSet<>();
        
        List<WatchlistItem> watchlist = watchlistItemRepository.findByUserId(user.getId());
        List<PortfolioItem> portfolio = portfolioItemRepository.findByUserId(user.getId());

        watchlist.forEach(item -> trackedSymbols.add(item.getStock().getSymbol()));
        portfolio.forEach(item -> trackedSymbols.add(item.getStock().getSymbol()));

        // Default fallbacks if empty so we can test notifications easily
        if (trackedSymbols.isEmpty()) {
            trackedSymbols.add("RELIANCE.NS");
            trackedSymbols.add("TCS.NS");
        }

        List<SentimentResponse.NewsItem> newArticlesToNotify = new ArrayList<>();

        for (String symbol : trackedSymbols) {
            try {
                SentimentResponse response = aiService.getSentiment(symbol);
                if (response != null && response.getArticles() != null) {
                    for (SentimentResponse.NewsItem article : response.getArticles()) {
                        String trackingKey = user.getId() + ":" + article.getUrl();
                        
                        // If it's a new article we haven't seen for this user
                        if (!processedNews.contains(trackingKey)) {
                            newArticlesToNotify.add(article);
                            processedNews.add(trackingKey);
                        }
                    }
                }
            } catch (Exception e) {
                logger.error("Failed to check news for {} - {}", symbol, e.getMessage());
            }
        }

        if (!newArticlesToNotify.isEmpty()) {
            sendNewsNotificationEmail(user, newArticlesToNotify);
        }
    }

    private void sendNewsNotificationEmail(User user, List<SentimentResponse.NewsItem> articles) {
        String subject = "Market Update: " + articles.size() + " New Articles for Your Stocks";
        
        StringBuilder html = new StringBuilder();
        html.append("<html><body style='font-family: Arial, sans-serif; color: #333;'>");
        html.append("<h2>Hello ").append(user.getFullName()).append(",</h2>");
        html.append("<p>We found some breaking news for the stocks in your watchlist/portfolio:</p>");
        
        html.append("<ul style='list-style-type: none; padding: 0;'>");
        for (SentimentResponse.NewsItem article : articles) {
            String color = getSentimentColor(article.getSentimentLabel());
            html.append("<li style='margin-bottom: 20px; padding: 15px; border-left: 4px solid ").append(color).append("; background-color: #f9f9f9;'>");
            html.append("<h3 style='margin: 0 0 10px 0;'>").append(article.getTitle()).append("</h3>");
            html.append("<p style='margin: 0; font-size: 14px; color: #666;'>");
            html.append("<strong>Source:</strong> ").append(article.getSource());
            html.append(" | <strong>Sentiment:</strong> <span style='color: ").append(color).append(";'>").append(article.getSentimentLabel()).append("</span>");
            html.append("</p>");
            html.append("<a href='").append(article.getUrl()).append("' style='display: inline-block; margin-top: 10px; color: #0066cc; text-decoration: none;'>Read Full Article &rarr;</a>");
            html.append("</li>");
        }
        html.append("</ul>");
        
        html.append("<p style='font-size: 12px; color: #999; margin-top: 30px;'>You are receiving these alerts because you have these stocks in your Stockify AI profile.</p>");
        html.append("</body></html>");

        emailService.sendHtmlMessage(user.getEmail(), subject, html.toString());
    }

    private String getSentimentColor(String label) {
        if (label == null) return "#666666";
        switch (label.toUpperCase()) {
            case "VERY_POSITIVE": return "#10b981"; // Green
            case "POSITIVE": return "#34d399";
            case "NEGATIVE": return "#f87171"; // Red
            case "VERY_NEGATIVE": return "#ef4444";
            case "NEUTRAL": 
            default: return "#9ca3af"; // Gray
        }
    }
}
