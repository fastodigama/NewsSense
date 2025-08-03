import NewsAPI from 'newsapi';
import NodeCache from 'node-cache';

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const newsCache = new NodeCache({ stdTTL: 3600 }); // cache for 30 minutes (consistent with your cache set later)

// Date formatter 
function formatDate(dateString) {
  const date = new Date(dateString);
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  return `${date.toLocaleDateString('en-CA', dateOptions)} · ${date.toLocaleTimeString('en-CA', timeOptions)}`;
}

async function getNews(category = null, country = 'us') {
  const cacheKey = `${country}-${category || 'all'}`;
  const cached = newsCache.get(cacheKey);
  if (cached) return cached;

  try {
    const params = {
      country,
      pageSize: 25
    };

    if (category) {
      params.category = category;
    }

    console.log("Fetching news with params:", params);

    const response = await newsapi.v2.topHeadlines(params);

    const articles = (response.articles || []).map(article => ({
      ...article,
      formattedDate: formatDate(article.publishedAt),
      category: category || 'general'
    }));

    newsCache.set(cacheKey, articles);
    return articles;
  } catch (error) {
    console.error(`Error fetching ${country} news:`, error);
    return [];
  }
}


export default {
  getNews
};