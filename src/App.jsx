import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import generatePhase from "./generatePhase";
import FavoritesList from "./favoritesList"; // make sure you have this component
import "./App.css"; // import your CSS file

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
// Add this inside your component
const setAllDifficulties = (newDifficulty) => {
  setDifficulties(Array(10).fill(newDifficulty));
};

  // helper to calculate master difficulty value
const getMasterDifficulty = () => {
  const first = difficulties[0];
  if (difficulties.every((d) => d === first)) {
    return first; // all same
  }
  return "mixed"; // different values
};

  
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
    <div className="app-container">
      <nav className="nav-bar">
        <Link to="/" className="nav-link">Generator</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>
      </nav>

      <h1 className="app-title">Custom Phase 10 Generator</h1>

      <Routes>
        <Route
          path="/"
          element={
            <div className="phases-list">

              {/* Master dropdown */}
              <div className="master-dropdown">
                <label>Set all difficulties: </label>
                <select
                  value={
                    difficulties.every(d => d === difficulties[0])
                      ? difficulties[0]  // all same → show that
                      : "mixed"           // otherwise → mixed
                  }
                  onChange={(e) => {
                    if (e.target.value !== "mixed") {
                      setDifficulties(Array(10).fill(e.target.value));
                    }
                  }}
                >
                  <option value="mixed" disabled>Mixed</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Individual dropdowns */}
              {phases.map((phase, i) => (
                <div key={i} className="phase-card" style={{ "--phase-index": i }}>
                  <div className="phase-card-content">
                    <label className="phase-label">
                      <input
                        type="checkbox"
                        checked={locked[i]}
                        onChange={() => toggleLock(i)}
                      />
                      <span className="phase-name"> Phase {i + 1}: {phase}</span>
                    </label>
                     <br/>
                    <select
                      className="phase-dropdown"
                      value={difficulties[i]}
                      onChange={(e) => changeDifficulty(i, e.target.value)}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>

                    <button
                      className={`favorite-btn ${favorites.includes(phase) ? "active" : ""}`}
                      onClick={() => toggleFavorite(phase)}
                    >
                      {favorites.includes(phase) ? "★ Favorited" : "☆ Favorite"}
                    </button>
                  </div>
                </div>
              ))}

              <button className="regenerate-btn" onClick={regenerate}>
                🎲 Regenerate
              </button>
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
