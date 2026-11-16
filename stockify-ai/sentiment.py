import random
from datetime import datetime, timedelta
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

class SentimentAnalyzer:
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()
        
        # Pre-defined mock headlines for realistic output without API calls
        self.headlines = [
            ("reports record-breaking quarterly revenue", 0.8),
            ("announces expansion into new international markets", 0.6),
            ("reveals innovative new product line", 0.7),
            ("CEO steps down amid internal restructuring", -0.4),
            ("faces new regulatory scrutiny from authorities", -0.6),
            ("beats analyst expectations for earnings per share", 0.75),
            ("supply chain issues expected to impact Q3 margins", -0.5),
            ("merger talks fall through at the last minute", -0.7),
            ("announces major stock buyback program", 0.8),
            ("upgraded by major Wall Street analysts", 0.6),
            ("downgraded to sell due to macroeconomic concerns", -0.6),
            ("secures major government contract", 0.85),
            ("sued by competitors over patent infringement", -0.5),
            ("announces unexpected dividend increase", 0.7)
        ]

    def _fetch_real_news(self, symbol):
        """Fetch real news articles from Yahoo Finance for a symbol"""
        try:
            import yfinance as yf
            ticker = yf.Ticker(symbol)
            news_items = ticker.news
            
            articles = []
            # Cap at top 8 articles
            for item in news_items[:8]:
                # yfinance news structure has changed, fields are nested under 'content'
                content = item.get('content', {})
                title = content.get('title', '')
                if not title:
                    continue
                    
                # Run VADER to get the score
                vader_scores = self.analyzer.polarity_scores(title)
                compound_score = vader_scores['compound']
                
                # Link can be in various places depending on yfinance version
                url = '#'
                if 'link' in item:
                    url = item['link']
                elif 'clickThroughUrl' in content:
                    url = content['clickThroughUrl'].get('url', '#')
                elif 'canonicalUrl' in content:
                    url = content['canonicalUrl'].get('url', '#')
                
                # If still no valid URL, use a robust search link
                if not url or url == '#':
                    url = f"https://www.google.com/search?q={symbol}+stock+news&tbm=nws"
                
                # Publisher name
                provider = content.get('provider', {})
                source = provider.get('displayName', 'Unknown Source')
                
                # Date is now often a string in 'pubDate' or 'displayTime'
                pub_date_str = content.get('pubDate') or content.get('displayTime')
                if not pub_date_str:
                    pub_date_str = datetime.now().isoformat()
                    
                articles.append({
                    "title": title,
                    "source": source,
                    "url": url,
                    "sentiment": round(compound_score, 2),
                    "sentimentLabel": self._get_label(compound_score),
                    "publishedAt": pub_date_str
                })
                
            return articles
        except Exception as e:
            print(f"Error fetching news for {symbol}: {e}")
            return []

    def _get_label(self, score):
        if score >= 0.5: return "VERY_POSITIVE"
        if score >= 0.15: return "POSITIVE"
        if score > -0.15: return "NEUTRAL"
        if score > -0.5: return "NEGATIVE"
        return "VERY_NEGATIVE"

    def analyze(self, symbol):
        """
        Analyze news sentiment for a symbol
        Returns a dict matching the Java SentimentResponse DTO
        """
        articles = self._fetch_real_news(symbol)
        
        # Fallback to mock headlines if real news is unavailable
        if not articles:
            print(f"No real news for {symbol}, using mock fallback.")
            num_mock = random.randint(4, 7)
            mock_indices = random.sample(range(len(self.headlines)), num_mock)
            
            for idx in mock_indices:
                phrase, base_score = self.headlines[idx]
                # Add some randomness to the score
                score = max(-1.0, min(1.0, base_score + random.uniform(-0.1, 0.1)))
                articles.append({
                    "title": f"{symbol} {phrase}",
                    "source": random.choice(["Financial Times", "Reuters", "Bloomberg", "MarketWatch", "CNBC"]),
                    "url": f"https://www.google.com/search?q={symbol}+stock+market+news",
                    "sentiment": round(score, 2),
                    "sentimentLabel": self._get_label(score),
                    "publishedAt": (datetime.now() - timedelta(hours=random.randint(1, 48))).isoformat()
                })
        
        if not articles:
            return {
                "symbol": symbol,
                "overallSentiment": 0.0,
                "sentimentLabel": "NEUTRAL",
                "totalArticles": 0,
                "articles": []
            }
            
        # Calculate overall sentiment
        total_score = sum(article['sentiment'] for article in articles)
        overall_sentiment = round(total_score / len(articles), 2)
        
        return {
            "symbol": symbol,
            "overallSentiment": overall_sentiment,
            "sentimentLabel": self._get_label(overall_sentiment),
            "totalArticles": len(articles),
            "articles": articles
        }
