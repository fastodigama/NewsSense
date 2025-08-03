// Import the NewsAPI library to interact with the NewsAPI service
import NewsAPI from 'newsapi';
// Import NodeCache for in-memory caching of news data
import NodeCache from 'node-cache';
// Initialize NewsAPI with your API key from environment variables
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
// Create a cache instance with a default TTL (time-to-live) of 3600 seconds (1 hour)
const newsCache = new NodeCache({ stdTTL: 3600 }); // cache for 60 minutes

/**
 * Formats a date string into a human-readable format.
 * Example output: "2025-Aug-03 · 02:37 AM"
 * @param {string} dateString - ISO date string to format
 * @returns {string} - Formatted date and time string
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  return `${date.toLocaleDateString('en-CA', dateOptions)} · ${date.toLocaleTimeString('en-CA', timeOptions)}`;
}

/**
 * Fetches top news headlines from NewsAPI, optionally filtered by category and country.
 * Uses caching to avoid redundant API calls.
 * @param {string|null} category - News category (e.g., 'technology', 'sports'), or null for all
 * @param {string} country - Country code (e.g., 'us', 'ca')
 * @returns {Promise<Array>} - Array of formatted news articles
 */
async function getNews(category = null, country = 'us') {
    // Construct a unique cache key based on country and category
  const cacheKey = `${country}-${category || 'all'}`;
    // Check if the news data is already cached
  const cached = newsCache.get(cacheKey);
  if (cached) return cached;// Return cached data if available

  try {
    // Set up parameters for the API request
    const params = {
      country,
      pageSize: 25 // Limit to 25 articles
    };
    // Add category to parameters if specified
    if (category) {
      params.category = category;
    }
// Log the parameters being used for debugging
    console.log("Fetching news with params:", params);

    // Make the API call to fetch top headlines
    const response = await newsapi.v2.topHeadlines(params);

    // Format each article and add a category field
    const articles = (response.articles || []).map(article => ({
      ...article,
      formattedDate: formatDate(article.publishedAt),
      category: category || 'general' // Default to 'general' if no category provided
    }));

    // Store the formatted articles in cache
    newsCache.set(cacheKey, articles);

    // Return the formatted articles
    return articles;
  } catch (error) {
    // Log any errors and return an empty array
    console.error(`Error fetching ${country} news:`, error);
    return [];
  }
};


export default {
  getNews
};