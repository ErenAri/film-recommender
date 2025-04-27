import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { genreId } = req.body;

    try {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: genreId,
          sort_by: 'popularity.desc',
          language: 'en-US',
          page: 1,
        },
      });

      const movies = response.data.results.slice(0, 5).map((movie) => ({
        title: movie.title,
        overview: movie.overview,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      }));

      res.status(200).json({ movies });
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
