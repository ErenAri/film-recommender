'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/globals.css';


export default function Home() {
  const [genre, setGenre] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre }),
      });
      const data = await response.json();
      setMovies(data.movies);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col items-center p-8">
      <motion.h1
        className="text-5xl font-extrabold text-white mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🎬 Film Önerici
      </motion.h1>

      <div className="flex gap-4 mb-8">
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Tür gir (örnek: Action)"
          className="p-3 rounded-lg w-64 outline-none text-gray-800"
        />
        <button
          onClick={handleRecommend}
          className="p-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100"
        >
          {loading ? 'Yükleniyor...' : 'Öneri Al'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {movies.map((movie, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transform transition duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <img src={movie.poster} alt={movie.title} className="w-full h-96 object-cover" />
            <div className="p-4 text-center">
              <h2 className="text-lg font-bold text-gray-800">{movie.title}</h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
