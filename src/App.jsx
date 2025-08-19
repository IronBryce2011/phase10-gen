import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import generatePhase from "./generatePhase";
import FavoritesList from "./favoritesList"; // make sure you have this component

function App() {
  const defaultDifficulties = Array(10).fill("easy");

  const [difficulties, setDifficulties] = useState(defaultDifficulties);
  const [phases, setPhases] = useState(
    difficulties.map((diff, i) => generatePhase(i + 1, diff))
  );
  const [locked, setLocked] = useState(Array(10).fill(false));
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const regenerate = () => {
    const seen = new Set(phases.filter((_, i) => locked[i]));

    const newPhases = phases.map((phase, i) => {
      if (locked[i]) return phase;

      let newPhase;
      let attempts = 0;

      do {
        newPhase = generatePhase(i + 1, difficulties[i]);
        attempts++;
        if (attempts > 50) break;
      } while (seen.has(newPhase));

      seen.add(newPhase);
      return newPhase;
    });

    setPhases(newPhases);
  };

  const toggleLock = (index) => {
    setLocked(locked.map((val, i) => (i === index ? !val : val)));
  };

  const changeDifficulty = (index, newDifficulty) => {
    setDifficulties(difficulties.map((diff, i) => (i === index ? newDifficulty : diff)));
  };

  const toggleFavorite = (phase) => {
    setFavorites((prev) => {
      let newFavorites;
      if (prev.includes(phase)) {
        newFavorites = prev.filter((f) => f !== phase);
      } else {
        newFavorites = [...prev, phase];
      }
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return (
    <Router>
      <div>
        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>Generator</Link>
          <Link to="/favorites">Favorites</Link>
        </nav>
  <h1>Custom Phase 10 Generator</h1>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                {phases.map((phase, i) => (
                  <div key={i} style={{ marginBottom: "1rem" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={locked[i]}
                        onChange={() => toggleLock(i)}
                      />{" "}
                      <strong>Phase {i + 1}:</strong> {phase}
                    </label>
                    <br />
                    <select
                      value={difficulties[i]}
                      onChange={(e) => changeDifficulty(i, e.target.value)}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <button
                      onClick={() => toggleFavorite(phase)}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      {favorites.includes(phase) ? "★ Favorited" : "☆ Favorite"}
                    </button>
                  </div>
                ))}
                <button onClick={regenerate}>🎲 Regenerate</button>
              </div>
            }
          />
          <Route path="/favorites" element={<FavoritesList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
