package com.stockify.service;

import com.stockify.dto.LiveStockData;
import com.stockify.model.Stock;
import com.stockify.model.StockMetrics;
import com.stockify.repository.StockRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockUpdateService {

    private static final Logger logger = LoggerFactory.getLogger(StockUpdateService.class);

    private final StockRepository stockRepository;
    private final WebClient webClient;

    @Value("${app.ai.service-url}")
    private String aiServiceUrl;

    public StockUpdateService(StockRepository stockRepository, WebClient.Builder webClientBuilder) {
        this.stockRepository = stockRepository;
        this.webClient = webClientBuilder.build();
    }

    /**
     * Update all stock prices and metrics every 5 minutes.
     * Fixed rate: 300,000 ms = 5 minutes.
     */
    @Scheduled(fixedRate = 300000)
    @Transactional
    public void updateAllStocks() {
        logger.info("Starting scheduled stock price update...");
        List<Stock> stocks = stockRepository.findAll();
        
        for (Stock stock : stocks) {
            updateStockData(stock);
        }
        logger.info("Finished scheduled stock price update for {} stocks.", stocks.size());
    }

    private void updateStockData(Stock stock) {
        try {
            logger.debug("Updating live data for {}", stock.getSymbol());
            
            LiveStockData liveData = webClient.get()
                    .uri(aiServiceUrl + "/stock-data/" + stock.getSymbol())
                    .retrieve()
                    .bodyToMono(LiveStockData.class)
                    .timeout(java.time.Duration.ofSeconds(10))
                    .block();

            if (liveData != null) {
                stock.setCurrentPrice(liveData.getCurrentPrice());
                stock.setPreviousClose(liveData.getPreviousClose());
                stock.setDayChange(liveData.getDayChange());
                stock.setDayChangePercent(liveData.getDayChangePercent());
                stock.setVolume(liveData.getVolume());
                stock.setLastUpdated(LocalDateTime.now());

                // Update Metrics if they exist
                StockMetrics metrics = stock.getMetrics();
                if (metrics != null) {
                    if (liveData.getPeRatio() != null) metrics.setPeRatio(liveData.getPeRatio());
                    if (liveData.getEps() != null) metrics.setEps(liveData.getEps());
                    if (liveData.getMarketCap() != null) metrics.setMarketCap(liveData.getMarketCap());
                    if (liveData.getFiftyTwoWeekHigh() != null) metrics.setFiftyTwoWeekHigh(liveData.getFiftyTwoWeekHigh());
                    if (liveData.getFiftyTwoWeekLow() != null) metrics.setFiftyTwoWeekLow(liveData.getFiftyTwoWeekLow());
                    metrics.setUpdatedAt(LocalDateTime.now());
                }

                stockRepository.save(stock);
            }
        } catch (Exception e) {
            logger.error("Failed to update data for {}: {}", stock.getSymbol(), e.getMessage());
        }
    }
}
