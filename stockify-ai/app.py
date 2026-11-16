from flask import Flask, jsonify, request
from flask_cors import CORS
from model import StockPredictor
from sentiment import SentimentAnalyzer
from data_provider import DataProvider
import os

app = Flask(__name__)
# Enable CORS for the Spring Boot backend
CORS(app, resources={r"/*": {"origins": ["http://localhost:8080", "http://backend:8080"]}})

# Initialize AI models
predictor = StockPredictor()
sentiment_analyzer = SentimentAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy", "service": "Stockify AI Microservice"})

@app.route('/predict/<symbol>', methods=['GET'])
def predict_stock(symbol):
    """
    Generate Buy/Hold/Sell prediction for a stock symbol 
    using the Random Forest model.
    """
    if not symbol:
        return jsonify({"error": "Stock symbol is required"}), 400
        
    try:
        prediction = predictor.predict(symbol.upper())
        return jsonify(prediction)
    except Exception as e:
        app.logger.error(f"Prediction error for {symbol}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/sentiment/<symbol>', methods=['GET'])
def analyze_sentiment(symbol):
    """
    Analyze news sentiment for a given stock symbol
    using VADER sentiment analysis.
    """
    if not symbol:
        return jsonify({"error": "Stock symbol is required"}), 400
        
    try:
        sentiment = sentiment_analyzer.analyze(symbol.upper())
        return jsonify(sentiment)
    except Exception as e:
        app.logger.error(f"Sentiment error for {symbol}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/stock-data/<symbol>', methods=['GET'])
def get_live_data(symbol):
    """
    Fetch real-time stock data from yfinance
    """
    if not symbol:
        return jsonify({"error": "Stock symbol is required"}), 400
        
    try:
        data = DataProvider.get_stock_info(symbol.upper())
        if data:
            return jsonify(data)
        else:
            return jsonify({"error": "Could not fetch data for " + symbol}), 404
    except Exception as e:
        app.logger.error(f"Data fetch error for {symbol}: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
