import { useState } from 'react';

export default function Home() {
  const [genre, setGenre] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getRecommendations() {
    if (!genre.trim()) {
      alert('Lütfen bir tür (genre) girin!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre }),
      });

      const data = await response.json();
      setMovies(data.movies || []);
    } catch (error) {
      console.error('Hata oluştu:', error);
      alert('Bir hata oluştu. Konsolu kontrol edin.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎬 Film Önerici</h1>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Tür girin (ör: aksiyon, komedi)"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={getRecommendations}
          style={styles.button}
        >
          {loading ? 'Yükleniyor...' : 'Öneri Al'}
        </button>
      </div>

      <div style={styles.cardGrid}>
        {movies.map((movie, index) => (
          <div key={index} style={styles.card}>
            <h3 style={styles.cardTitle}>{movie}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
  },
  title: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem'
  },
  input: {
    padding: '0.5rem',
    width: '250px',
    border: '1px solid #ccc',
    borderRadius: '8px'
  },
  button: {
    marginLeft: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold'
  }
};
