package com.stockify.service;

import com.stockify.dto.StockResponse;
import com.stockify.model.Stock;
import com.stockify.model.StockHistory;
import com.stockify.model.StockMetrics;
import com.stockify.repository.StockHistoryRepository;
import com.stockify.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final StockHistoryRepository stockHistoryRepository;

    public StockService(StockRepository stockRepository, StockHistoryRepository stockHistoryRepository) {
        this.stockRepository = stockRepository;
        this.stockHistoryRepository = stockHistoryRepository;
    }

    public List<StockResponse> searchStocks(String query) {
        List<Stock> stocks = stockRepository.searchStocks(query);
        return stocks.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public StockResponse getStockBySymbol(String symbol) {
        Stock stock = stockRepository.findBySymbol(symbol.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Stock not found: " + symbol));
        return mapToResponse(stock);
    }

    public List<StockResponse> getAllStocks() {
        return stockRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<StockResponse> getStocksBySector(String sector) {
        return stockRepository.findBySectorIgnoreCase(sector).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<String> getAllSectors() {
        return stockRepository.findAllSectors();
    }

    public List<StockHistory> getStockHistory(String symbol, int days) {
        // Try to get from DB first
        List<StockHistory> history = stockHistoryRepository.findByStockSymbolAndDateBetweenOrderByDateAsc(
                symbol.toUpperCase(), LocalDate.now().minusDays(days), LocalDate.now());

        // If no history data, generate mock data
        if (history.isEmpty()) {
            history = generateMockHistory(symbol, days);
        }
        return history;
    }

    private List<StockHistory> generateMockHistory(String symbol, int days) {
        Stock stock = stockRepository.findBySymbol(symbol.toUpperCase()).orElse(null);
        double basePrice = stock != null && stock.getCurrentPrice() != null
                ? stock.getCurrentPrice().doubleValue() : 150.0;

        List<StockHistory> history = new ArrayList<>();
        Random random = new Random(symbol.hashCode());
        double price = basePrice * 0.85; // Start 15% below current

        for (int i = days; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            if (date.getDayOfWeek().getValue() > 5) continue; // Skip weekends

            double change = (random.nextDouble() - 0.48) * (basePrice * 0.03);
            price = Math.max(price + change, basePrice * 0.5);

            double open = price + (random.nextDouble() - 0.5) * (basePrice * 0.01);
            double high = Math.max(price, open) + random.nextDouble() * (basePrice * 0.015);
            double low = Math.min(price, open) - random.nextDouble() * (basePrice * 0.015);
            long vol = (long) (5000000 + random.nextInt(15000000));

            history.add(StockHistory.builder()
                    .date(date)
                    .openPrice(BigDecimal.valueOf(open).setScale(2, RoundingMode.HALF_UP))
                    .highPrice(BigDecimal.valueOf(high).setScale(2, RoundingMode.HALF_UP))
                    .lowPrice(BigDecimal.valueOf(low).setScale(2, RoundingMode.HALF_UP))
                    .closePrice(BigDecimal.valueOf(price).setScale(2, RoundingMode.HALF_UP))
                    .volume(vol)
                    .build());
        }
        return history;
    }

    private StockResponse mapToResponse(Stock stock) {
        StockMetrics metrics = stock.getMetrics();

        StockResponse.StockResponseBuilder builder = StockResponse.builder()
                .id(stock.getId())
                .symbol(stock.getSymbol())
                .companyName(stock.getCompanyName())
                .sector(stock.getSector())
                .industry(stock.getIndustry())
                .currentPrice(stock.getCurrentPrice())
                .previousClose(stock.getPreviousClose())
                .dayChange(stock.getDayChange())
                .dayChangePercent(stock.getDayChangePercent())
                .volume(stock.getVolume());

        if (metrics != null) {
            builder.peRatio(metrics.getPeRatio())
                    .eps(metrics.getEps())
                    .marketCap(metrics.getMarketCap())
                    .revenueGrowth(metrics.getRevenueGrowth())
                    .debtToEquity(metrics.getDebtToEquity())
                    .dividendYield(metrics.getDividendYield())
                    .bookValue(metrics.getBookValue())
                    .roe(metrics.getRoe())
                    .fiftyTwoWeekHigh(metrics.getFiftyTwoWeekHigh())
                    .fiftyTwoWeekLow(metrics.getFiftyTwoWeekLow());

            // Add beginner-friendly explanations
            builder.peRatioExplanation(getPeExplanation(metrics.getPeRatio()));
            builder.epsExplanation(getEpsExplanation(metrics.getEps()));
            builder.marketCapExplanation(getMarketCapExplanation(metrics.getMarketCap()));
            builder.revenueGrowthExplanation(getRevenueGrowthExplanation(metrics.getRevenueGrowth()));
            builder.debtToEquityExplanation(getDebtExplanation(metrics.getDebtToEquity()));
        }

        return builder.build();
    }

    private String getPeExplanation(BigDecimal pe) {
        if (pe == null) return "P/E Ratio data not available.";
        double val = pe.doubleValue();
        if (val < 0) return "Negative P/E means the company is currently losing money. This is common for growing companies investing heavily.";
        if (val < 15) return "Low P/E (" + val + ") suggests the stock may be undervalued — investors are paying less for each dollar of earnings. Could be a good deal!";
        if (val < 25) return "Moderate P/E (" + val + ") is typical for established companies. The stock is fairly priced based on its earnings.";
        if (val < 50) return "High P/E (" + val + ") indicates investors expect high future growth. They're willing to pay more now for expected earnings growth.";
        return "Very high P/E (" + val + ") means extremely high growth expectations. The stock is expensive relative to current earnings — higher risk.";
    }

    private String getEpsExplanation(BigDecimal eps) {
        if (eps == null) return "EPS data not available.";
        double val = eps.doubleValue();
        if (val < 0) return "Negative EPS (₹" + val + ") means the company is losing money per share. This isn't necessarily bad for growth companies.";
        if (val < 2) return "EPS of ₹" + val + " is relatively low. The company earns modest profit per share. Compare with industry peers for context.";
        if (val < 10) return "EPS of ₹" + val + " shows solid profitability. The company earns good profit for each share outstanding.";
        return "High EPS of ₹" + val + " indicates strong profitability! The company generates excellent earnings per share.";
    }

    private String getMarketCapExplanation(BigDecimal marketCap) {
        if (marketCap == null) return "Market cap data not available.";
        double val = marketCap.doubleValue();
        if (val < 2_000_000_000L) return "Small-cap company (under $2B). Higher growth potential but also higher risk and volatility.";
        if (val < 10_000_000_000L) return "Mid-cap company ($2B-$10B). Good balance of growth potential and stability.";
        if (val < 200_000_000_000L) return "Large-cap company ($10B-$200B). Generally stable with moderate growth. Lower risk for investors.";
        return "Mega-cap company (over $200B). One of the largest companies in the world. Very stable and often pays dividends.";
    }

    private String getRevenueGrowthExplanation(BigDecimal growth) {
        if (growth == null) return "Revenue growth data not available.";
        double val = growth.doubleValue() * 100;
        if (val < 0) return "Revenue declined by " + String.format("%.1f", Math.abs(val)) + "%. The company's sales are shrinking — investigate why before investing.";
        if (val < 5) return "Slow growth (" + String.format("%.1f", val) + "%). Company is growing modestly, typical for mature businesses.";
        if (val < 15) return "Healthy growth (" + String.format("%.1f", val) + "%). Company is expanding at a solid rate — a good sign!";
        return "Rapid growth (" + String.format("%.1f", val) + "%)! Company is growing fast — exciting but make sure the growth is sustainable.";
    }

    private String getDebtExplanation(BigDecimal dte) {
        if (dte == null) return "Debt-to-Equity data not available.";
        double val = dte.doubleValue();
        if (val < 0.3) return "Very low debt (" + val + "). The company is conservatively financed — lower risk of financial trouble.";
        if (val < 1.0) return "Moderate debt (" + val + "). Healthy balance between debt and equity. Standard for most companies.";
        if (val < 2.0) return "High debt (" + val + "). Company relies significantly on borrowing. Check if they can comfortably service this debt.";
        return "Very high debt (" + val + "). The company is heavily leveraged — higher risk of financial difficulties in downturns.";
    }
}
