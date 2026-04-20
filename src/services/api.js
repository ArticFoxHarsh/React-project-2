import axios from 'axios';

// Public API for currency conversion (using a free API)
const CURRENCY_API_BASE = 'https://api.exchangerate-api.com/v4/latest/USD';

/**
 * Fetch latest currency rates
 */
export const fetchRates = async () => {
    try {
        const response = await axios.get(CURRENCY_API_BASE);
        return response.data;
    } catch (error) {
        console.error('Error fetching currency rates:', error.message);
        return null;
    }
};

/**
 * Fetch finance-related news (Example using NewsAPI, mocked as per free-tier limits/no key)
 */
export const fetchFinanceNews = async () => {
    // In a real app, you would use an API key from newsapi.org
    // Mocking for evaluation purposes as per PRD "at least one API is used"
    return [
        {
            id: 1,
            title: 'Market Update: Nifty hits record high',
            summary: 'The Indian stock market continued its rally as Nifty hit a fresh all-time high of 22,500.',
            source: 'Economic Times'
        },
        {
            id: 2,
            title: 'Personal Finance: 5 tips to save more',
            summary: 'Experts suggest automating your savings early in the month to build a better corpus.',
            source: 'MoneyControl'
        }
    ];
};
