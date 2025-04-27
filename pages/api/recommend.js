// pages/api/recommend.js
import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { genre } = req.body;

    try {
      const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: TMDB_API_KEY,
          query: genre,
          language: 'en-US',
        },
      });
      
      const movies = response.data.results
        .filter((movie) => movie.poster_path) // poster'ı olmayanları ele
        .slice(0, 5)
        .map((movie) => ({
          title: movie.title,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }));

      res.status(200).json({ movies });
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch movies' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
