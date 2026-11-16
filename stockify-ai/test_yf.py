import yfinance as yf

def test_fetch(symbol):
    print(f"Fetching data for {symbol}...")
    stock = yf.Ticker(symbol)
    data = stock.history(period="1d")
    if not data.empty:
        current_price = data['Close'].iloc[-1]
        print(f"Price: {current_price}")
        return current_price
    else:
        print("No data found")
        return None

if __name__ == "__main__":
    test_fetch("RELIANCE.NS")
    test_fetch("TCS.NS")
