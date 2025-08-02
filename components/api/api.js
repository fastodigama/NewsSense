import NewsAPI from 'newsapi';
import NodeCache from 'node-cache';

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const newsCache = new NodeCache({ stdTTL: 3600 }); // cash for 30 minutes 

// Date formatter 
function formatDate(dateString) {
  const date = new Date(dateString);
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  return `${date.toLocaleDateString('en-CA', dateOptions)} · ${date.toLocaleTimeString('en-CA', timeOptions)}`;
}
async function getNews(category = null) {
  const cacheKey = `canadian-${category || 'all'}`;
  const cached = newsCache.get(cacheKey);
  if (cached) return cached;

  // First get all available  sources
  const sources = (await newsapi.v2.sources({
    q: 'canada',
    language: 'en'
  })).sources.map(s => s.id);

  if (sources.length === 0) {
    console.warn('No  sources found');
    return [];
  }

  // Then fetch headlines from those sources
  const params = {
    sources: sources.join(','),
    pageSize: 25
  };

  if (category) {
    params.category = category;
    // NewsAPI requires either sources OR country/category
    delete params.sources;
  }

  const response = await newsapi.v2.topHeadlines(params);

  // Double-filter to ensure Canadian sources
  const articles = (response.articles || [])
    .filter(article => sources.includes(article.source.id))
    .map(article => ({
      ...article,
      formattedDate: formatDate(article.publishedAt),
      category: category || 'general'
    }));

  newsCache.set(cacheKey, articles, 1800);
  return articles;
};
export default {
  getNews
};