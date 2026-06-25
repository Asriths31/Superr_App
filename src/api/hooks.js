import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './asyncHandler';
import {
  WEATHER_URL,
  NEWS_URL,
  NEWS_FALLBACK_URL,
  OMDB_URL,
  OMDB_DETAILS_URL,
} from './routes';

export function useWeather() {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const lat = 28.6139;
  const lon = 77.2090;

  const { data, isLoading, error } = useQuery({
    queryKey: ['weather'],
    queryFn: async () => {
      const url = WEATHER_URL(lat, lon, apiKey, "Hyderabad");
      const { data: fetchRes, error: fetchErr } = await apiFetch(url);

      if (fetchErr) {
        throw new Error(fetchErr);
      }

      return {
        temp: Math.round(fetchRes?.main?.temp ?? 24),
        pressure: Math.round(fetchRes?.main?.pressure ?? 1010),
        wind: Math.round((fetchRes?.wind?.speed ?? 1) * 3.6 * 10) / 10,
        humidity: Math.round(fetchRes?.main?.humidity ?? 83),
        condition: fetchRes?.weather?.[0]?.main ?? "Cloudy",
        icon: fetchRes?.weather?.[0]?.icon ?? "03d",
      };
    }
  });

  return { weather: data, loading: isLoading, error: error ? error.message : null };
}

export function useNews() {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
   let url = NEWS_URL(apiKey);

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data: fetchRes, error: fetchErr } = await apiFetch(url);

      if (fetchErr || !fetchRes?.articles?.length) {
        if (url !== NEWS_FALLBACK_URL) {
          const mirrorData = await apiFetch(NEWS_FALLBACK_URL);
          if (mirrorData.error || !mirrorData.data?.articles?.length) {
            throw new Error("Could not retrieve news articles");
          }
          return mirrorData.data.articles.filter(a => a.title && a.description && a.urlToImage);
        }
        throw new Error(fetchErr || "Empty articles list");
      }

      return fetchRes.articles.filter(a => a.title && a.description && a.urlToImage);
    }
  });

  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    if (!articles || !articles.length) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % articles.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [articles]);

  const activeArticle = (articles && articles[activeIndex]) || null;

  return { activeArticle, loading: isLoading, error: error ? error.message : null };
}

export function useMovies(categories) {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;

  const { data: moviesByGenre, isLoading, error } = useQuery({
    queryKey: ['movies', categories],
    queryFn: async () => {
      if (!apiKey || apiKey === 'your_omdb_api_key') {
        throw new Error("OMDB API key is missing or invalid");
      }

      const results = {};
      const fetchPromises = categories.map(async (category) => {
        const searchTerm = category === 'Fiction' ? 'Sci-Fi' : category;
        const url = OMDB_URL(searchTerm, apiKey);
        const { data: fetchRes, error: fetchErr } = await apiFetch(url);

        if (fetchErr) {
          throw new Error(fetchErr);
        }

        if (!fetchRes?.Search?.length) {
          results[category] = [];
        } else {
          results[category] = fetchRes.Search.map(movie => ({
            imdbID: movie.imdbID,
            Title: movie.Title,
            Year: movie.Year,
            Poster: movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500',
            Type: movie.Type
          }));
        }
      });

      await Promise.all(fetchPromises);
      return results;
    },
    enabled: categories && categories.length > 0
  });

  return { moviesByGenre: moviesByGenre || {}, loading: isLoading, error: error ? error.message : null };
}

export function useMovieDetails(movieId) {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;

  const { data: details = null, isLoading, error } = useQuery({
    queryKey: ['movieDetails', movieId],
    queryFn: async () => {
      if (!movieId) return null;

      if (!apiKey || apiKey === 'your_omdb_api_key') {
        throw new Error("OMDB API key is missing or invalid");
      }

      const url = OMDB_DETAILS_URL(movieId, apiKey);
      const { data: fetchRes, error: fetchErr } = await apiFetch(url);

      if (fetchErr) {
        throw new Error(fetchErr);
      }

      return {
        Title: fetchRes?.Title,
        Genre: fetchRes?.Genre,
        Released: fetchRes?.Released,
        imdbRating: fetchRes?.imdbRating,
        Plot: fetchRes?.Plot !== 'N/A' ? fetchRes?.Plot : "No description available.",
        Poster: fetchRes?.Poster !== 'N/A' ? fetchRes?.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500',
      };
    },
    enabled: !!movieId
  });

  return { details, loading: isLoading, error: error ? error.message : null };
}
