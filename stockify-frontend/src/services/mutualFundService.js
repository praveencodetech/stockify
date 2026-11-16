// Mock data for Indian Mutual Funds with expanded metrics
const mockSchemes = [
  // Large Cap
  {
    id: 'lc-1',
    name: 'ICICI Prudential Bluechip Fund',
    category: 'Large Cap',
    expectedReturn: 15.5,
    riskLevel: 'Moderate',
    minSipAmount: 100,
    rating: 5,
    returns: { '1Y': 15.5, '3Y': 18.2, '5Y': 16.0 },
    benefits: ['Invests in top 100 established companies', 'Stable returns over the long term', 'Lower volatility compared to mid/small caps'],
    risks: ['Returns might be lower than aggressive funds during bull markets', 'Subject to broad market risks'],
    bestFor: 'Conservative Long-Term Growth'
  },
  {
    id: 'lc-2',
    name: 'Mirae Asset Large Cap Fund',
    category: 'Large Cap',
    expectedReturn: 14.8,
    riskLevel: 'Moderate',
    minSipAmount: 1000,
    rating: 4,
    returns: { '1Y': 14.8, '3Y': 17.5, '5Y': 15.2 },
    benefits: ['Consistent performer in the large-cap space', 'Strong stock picking strategy', 'High liquidity'],
    risks: ['Higher minimum SIP amount', 'Market risk'],
    bestFor: 'Core Portfolio Foundation'
  },
  
  // Mid Cap
  {
    id: 'mc-1',
    name: 'HDFC Mid-Cap Opportunities Fund',
    category: 'Mid Cap',
    expectedReturn: 18.2,
    riskLevel: 'High',
    minSipAmount: 500,
    rating: 4,
    returns: { '1Y': 18.2, '3Y': 24.5, '5Y': 20.1 },
    risks: ['High volatility in the short term', 'Can underperform in market downturns'],
    bestFor: 'Aggressive Capital Appreciation',
    isTopFund: true
  },
  
  // Small Cap
  {
    id: 'sc-1',
    name: 'Nippon India Small Cap Fund',
    category: 'Small Cap',
    expectedReturn: 24.5,
    riskLevel: 'High',
    minSipAmount: 100,
    rating: 5,
    risks: ['Very high short-term volatility', 'Liquidity can be an issue during crashes'],
    bestFor: 'High-Risk Wealth Creation',
    isTopFund: true
  },
  
  // ELSS
  {
    id: 'el-1',
    name: 'Quant Tax Plan',
    category: 'ELSS',
    expectedReturn: 20.3,
    riskLevel: 'High',
    minSipAmount: 500,
    rating: 5,
    risks: ['Funds are locked for 3 years', 'High equity exposure brings volatility'],
    bestFor: 'Tax Saving + Growth',
    isTopFund: true
  },
  
  // Hybrid
  {
    id: 'hy-1',
    name: 'Edelweiss Balanced Advantage Fund',
    category: 'Hybrid',
    expectedReturn: 12.5,
    riskLevel: 'Low',
    minSipAmount: 500,
    rating: 4,
    returns: { '1Y': 12.5, '3Y': 14.2, '5Y': 13.0 },
    benefits: ['Automatically shifts between equity and debt based on market conditions', 'Provides downside protection', 'Tax efficient'],
    risks: ['Returns are generally lower than pure equity funds', 'Relies heavily on the fund manager\'s model'],
    bestFor: 'Balanced Risk/Reward'
  },

  // Debt Funds
  {
    id: 'df-1',
    name: 'Kotak Corporate Bond Fund',
    category: 'Debt',
    expectedReturn: 8.5,
    riskLevel: 'Low',
    minSipAmount: 1000,
    rating: 5,
    returns: { '1Y': 8.5, '3Y': 7.8, '5Y': 8.2 },
    benefits: ['Invests in high-rated corporate bonds', 'Predictable and stable returns', 'Better returns than most FDs'],
    risks: ['Interest rate risk (bond prices fall when rates rise)', 'Credit risk (though rare in top funds)'],
    bestFor: 'Stable Income / FD Alternative'
  },

  // Index Funds
  {
    id: 'if-1',
    name: 'UTI Nifty 50 Index Fund',
    category: 'Index',
    expectedReturn: 13.5,
    riskLevel: 'Moderate',
    minSipAmount: 500,
    rating: 5,
    returns: { '1Y': 13.5, '3Y': 15.1, '5Y': 14.5 },
    benefits: ['Very low expense ratio (cheap to manage)', 'Mirrors the Nifty 50 index exactly', 'No fund manager bias'],
    risks: ['Will perfectly mirror market falls', 'Cannot outperform the index'],
    bestFor: 'Passive Beginner Investing'
  }
];

export const mutualFundService = {
  /**
   * Retrieves all available SIP schemes
   */
  getAllSchemes: async () => {
    // Simulating API delay
    return new Promise(resolve => setTimeout(() => resolve(mockSchemes), 300));
  },

  /**
   * Evaluates the recommended scheme based on standard logic
   */
  getRecommendation: async (monthlyAmount, durationYears) => {
    const duration = Number(durationYears);
    
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulating network
    
    // Sort schemes by rating descending
    const sortedSchemes = [...mockSchemes].sort((a, b) => b.rating - a.rating);
    
    // Simple logic base
    if (duration >= 7) {
      return sortedSchemes.find(s => s.category === 'Small Cap' || s.category === 'Mid Cap');
    } else if (duration >= 3) {
      return sortedSchemes.find(s => s.category === 'Large Cap' || s.category === 'ELSS');
    } else {
      return sortedSchemes.find(s => s.category === 'Hybrid' || s.riskLevel === 'Low');
    }
  },

  /**
   * Generates a simple, beginner-friendly explanation for a fund
   */
  generateExplanation: (scheme) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const explanations = [
          `This is a ${scheme.category} fund, meaning it primarily invests in ${scheme.category === 'Large Cap' ? 'top 100 big, stable companies like Reliance and TCS' : scheme.category === 'Small Cap' ? 'smaller, fast-growing upcoming companies' : scheme.category === 'ELSS' ? 'tax-saving equity options with a 3-year lock-in' : 'a mix of different assets'}.`,
          `It has a ${scheme.riskLevel} risk rating, so you can expect ${scheme.riskLevel === 'High' ? 'short-term ups and downs, but high long-term growth' : scheme.riskLevel === 'Low' ? 'very stable, predictable returns without much market jumping' : 'moderate fluctuations with balanced growth'}.`,
          `Best suited for investors looking for ${scheme.bestFor.toLowerCase()}.`,
          `Expected historical average return is around ${scheme.expectedReturn}%.`
        ];
        resolve(explanations);
      }, 600); // Simulate AI generation delay
    });
  }
};
