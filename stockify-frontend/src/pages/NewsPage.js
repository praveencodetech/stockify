import React, { useState, useEffect } from 'react';
import { stockService } from '../services/stockService';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Clock, Search, RefreshCw } from 'lucide-react';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('RELIANCE.NS'); // Default symbol for news
  const [currentSymbol, setCurrentSymbol] = useState('RELIANCE.NS');

  const fetchNews = async (symbol) => {
    setLoading(true);
    try {
      const res = await stockService.getSentiment(symbol);
      setNews(res.data.articles || []);
      setCurrentSymbol(symbol.toUpperCase());
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(currentSymbol);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchNews(searchQuery.trim());
    }
  };

  const getSentimentStyle = (sentiment) => {
    if (sentiment > 0.2) return { color: 'var(--success)', bg: 'var(--success-bg)', icon: <TrendingUp size={16} /> };
    if (sentiment < -0.2) return { color: 'var(--danger)', bg: 'var(--danger-bg)', icon: <TrendingDown size={16} /> };
    return { color: 'var(--warning)', bg: 'var(--warning-bg)', icon: <TrendingUp size={16} style={{ transform: 'rotate(45deg)' }} /> };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="mb-2 flex items-center gap-2">
            <Newspaper className="text-primary" size={32} /> Market News
          </h1>
          <p className="text-muted text-lg">AI-analyzed latest headlines for {currentSymbol}</p>
        </div>
        
        <form onSubmit={handleSearch} className="w-full md:w-auto">
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Search size={18} />
            </div>
            <input
              type="text"
              className="input-control"
              style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', height: '3rem', borderRadius: 'var(--radius-xl)' }}
              placeholder="Search symbol (e.g. RELIANCE.NS)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-4 text-primary">
            <RefreshCw size={32} className="animate-spin" />
            <p className="text-muted">Fetching and analyzing headlines...</p>
          </div>
        </div>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((article, index) => {
            const style = getSentimentStyle(article.sentiment);
            return (
              <div key={index} className="glass-panel p-6 flex flex-col h-full" style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div className="badge flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {article.source}
                  </div>
                  <div className="badge flexItems-center gap-1" style={{ background: style.bg, color: style.color }}>
                    {style.icon} <span style={{ textTransform: 'capitalize' }}>{article.sentimentLabel.replace('_', ' ').toLowerCase()}</span>
                  </div>
                </div>
                
                <h3 className="mb-4 flex-grow" style={{ fontSize: '1.25rem', lineHeight: 1.4 }}>
                  {article.title}
                </h3>
                
                <div className="flex justify-between items-center mt-auto pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-1 text-muted text-sm">
                    <Clock size={14} /> {formatDate(article.publishedAt)}
                  </div>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:text-primary-hover text-sm font-medium">
                    Read Article <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center" style={{ borderStyle: 'dashed' }}>
          <Newspaper size={48} className="text-muted mx-auto mb-4 opacity-50" />
          <h3 className="mb-2">No news found</h3>
          <p className="text-muted">We couldn't find any recent news articles for {currentSymbol}.</p>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
