package com.stockify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SentimentResponse {
    private String symbol;
    private double overallSentiment;     // -1.0 (very negative) to 1.0 (very positive)
    private String sentimentLabel;       // VERY_NEGATIVE, NEGATIVE, NEUTRAL, POSITIVE, VERY_POSITIVE
    private int totalArticles;
    private List<NewsItem> articles;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NewsItem {
        private String title;
        private String source;
        private String url;
        private double sentiment;
        private String sentimentLabel;
        private String publishedAt;
    }
}
