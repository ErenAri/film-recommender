import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';
import OpenAI from 'openai';



const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3/search/movie';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

async function fetchMovieDetails(title) {
  try {
    const response = await axios.get(TMDB_API_URL, {
      params: {
        api_key: TMDB_API_KEY,
        query: title,
        language: 'en-US',
      },
    });

    const movie = response.data.results[0]; // İlk sonucu alıyoruz

    if (!movie) return null;

    return {
      title: movie.title,
      overview: movie.overview,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { genre } = req.body;

    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Suggest a list of 5 popular movies in the ${genre} genre with a brief description for each. Also, include the movie's poster URL.`,
        max_tokens: 100,
      });

      const movieTitles = response.data.choices[0].text
        .split('\n')
        .filter((line) => line.trim() !== '');

      // Her film için detayları almak
      const movieDetails = await Promise.all(
        movieTitles.map(async (title) => {
          const details = await fetchMovieDetails(title);
          return details;
        })
      );

      res.status(200).json({ movies: movieDetails.filter(Boolean) });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
