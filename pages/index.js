"use client";

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [genreId, setGenreId] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    if (!genreId) return alert("Lütfen bir tür seçin!");

    setLoading(true);
    setMovies([]);

    try {
      const response = await axios.post('/api/recommend', { genreId });
      setMovies(response.data.movies);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      alert('Film önerileri alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Film Önerici 🎬</h1>

      {/* Tür Seçimi */}
      <select
        className="p-2 mb-4 border rounded w-64"
        value={genreId}
        onChange={(e) => setGenreId(e.target.value)}
      >
        <option value="">Tür seçin</option>
        <option value="28">Action</option>
        <option value="35">Comedy</option>
        <option value="18">Drama</option>
        <option value="27">Horror</option>
      </select>

      {/* Öneri Al Butonu */}
      <button
        onClick={handleRecommend}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? "Yükleniyor..." : "Öneri Al"}
      </button>

      {/* Film Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {movies.map((movie, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={movie.poster} alt={movie.title} className="w-full h-72 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
              <p className="text-gray-600 text-sm">{movie.overview}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
