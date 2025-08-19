import { useState, useEffect } from "react";

function FavoritesList() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  return (
    <div>
      <h2>Favorited Phases</h2>
      {favorites.length === 0 && <p>No favorites yet.</p>}
      <ul>
        {favorites.map((phase, i) => (
          <li key={i}>{phase}</li>
        ))}
      </ul>
    </div>
  );
}

export default FavoritesList;
