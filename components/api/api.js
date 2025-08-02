import { log } from "console";
import NewsAPI from "newsapi";

const newsApi = new NewsAPI(process.env.apiKey);



async function getTrendingNewsByCountry(countryCode) {
  try {
    const response = await newsApi.v2.topHeadlines({
      q: countryCode,
      category: "entertainment",
      
      pageSize: 15,
      
    });

   
    console.log("📡 Sources Response:", JSON.stringify(response, null, 2));

    return response.articles;
  } catch (error) {
    console.error(" API call failed:", error);
    return [];
  }
}

async function getTopHeadlineSources({category, language, country}) {
    const response = await newsApi.v2.sources({
        category,
        language,
        country
    });
        return response.sources;
}

export default {
    getTrendingNewsByCountry,
    getTopHeadlineSources
};