function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Updated: now second parameter is difficulty
function generatePhase(phaseNumber, difficulty = "easy", attempts = 0) {
  let requirements = [];
  let parts;

  if (difficulty === "easy") parts = 1;
  else if (difficulty === "medium") parts = Math.random() < 0.5 ? 1 : 2;
  else if (difficulty === "hard") parts = 2;

  for (let i = 0; i < parts; i++) {
    const type = pickRandom(["set", "run", "color"]);
    let num;

    if (type === "set") {
      num = phaseNumber < 4 ? randBetween(3, 4)
          : phaseNumber < 8 ? randBetween(4, 5)
          : randBetween(3, 5); // smaller sets late
    } else if (type === "run") {
      num = phaseNumber < 4 ? randBetween(4, 5)
          : phaseNumber < 8 ? randBetween(5, 6)
          : randBetween(4, 6);
    } else {
      num = phaseNumber < 4 ? randBetween(4, 5)
          : phaseNumber < 8 ? randBetween(5, 6)
          : randBetween(3, 5);
    }

    requirements.push({ type, num });
  }

  const total = requirements.reduce((s, r) => s + r.num, 0);

  // Only retry if attempts <= 10 and total is too high
  if (total >= 9 && attempts <= 10) {
    return generatePhase(phaseNumber, difficulty, attempts + 1);
  }

  // Otherwise, just return whatever we got
  return requirements.map(r => {
    if (r.type === "set") return `Set of ${r.num}`;
    if (r.type === "run") return `Run of ${r.num}`;
    return `${r.num} of one color`;
  }).join(" + ");
}

export default generatePhase;