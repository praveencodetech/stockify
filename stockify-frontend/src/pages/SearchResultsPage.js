import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { stockService } from '../services/stockService';
import StockCard from '../components/StockCard';
import { Search, AlertCircle, RefreshCw } from 'lucide-react';

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Get query from URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        if (query.trim()) {
          const res = await stockService.searchStocks(query);
          setResults(res.data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container animate-fade-in">
      <div className="mb-8">
        <h1 className="mb-4">Search Results</h1>
        
        <form className="glass-panel p-4 mb-8 flex gap-4 items-center">
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Search size={20} />
            </div>
            <input
              type="text"
              name="q"
              defaultValue={query}
              className="input-control"
              style={{ width: '100%', paddingLeft: '3rem', marginBottom: 0, fontSize: '1.125rem', height: '3.5rem' }}
              placeholder="Search stocks by symbol or name..."
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '3.5rem', padding: '0 2rem' }}>
            Search
          </button>
        </form>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="flex flex-col items-center gap-4 text-primary">
              <RefreshCw size={32} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <p className="text-muted font-medium">Searching market data...</p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-muted mb-6">
              Found <strong className="text-main">{results.length}</strong> results for "{query}"
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map(stock => (
                  <StockCard key={stock.id} stock={stock} />
                ))}
              </div>
            ) : (
              <div className="glass-panel p-12 text-center" style={{ borderStyle: 'dashed' }}>
                <AlertCircle size={48} className="text-warning mx-auto mb-4 opacity-50" />
                <h3 className="mb-2">No matching stocks found</h3>
                <p className="text-muted">
                  We couldn't find any stocks matching "{query}". Try searching by a different company name or ticker symbol (e.g., RELIANCE.NS, TCS.NS, INFY.NS).
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <Link to={`/stock/${encodeURIComponent('TCS.NS')}`} className="badge" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'rgba(255,255,255,0.05)' }}>Try TCS (TCS.NS)</Link>
                  <Link to={`/stock/${encodeURIComponent('RELIANCE.NS')}`} className="badge" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'rgba(255,255,255,0.05)' }}>Try Reliance (RELIANCE.NS)</Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
