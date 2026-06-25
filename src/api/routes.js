// API endpoint paths and key references

export const WEATHER_URL = (lat, lon, apiKey,cityName="Hyderabad") => 
  `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

export const NEWS_URL = (apiKey) => 
  `https://newsapi.org/v2/top-headlines?country=us&category=general&apiKey=${apiKey}`;

// Fallback mirror in case NewsAPI blocks browser-based localhost requests (CORS) on free accounts
export const NEWS_FALLBACK_URL = 
  `https://saurav.tech/NewsAPI/top-headlines/category/general/in.json`;

export const OMDB_URL = (query, apiKey) => 
  `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&apikey=${apiKey}`;

export const OMDB_DETAILS_URL = (id, apiKey) => 
  `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${apiKey}`;
