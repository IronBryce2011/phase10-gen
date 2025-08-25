import React from "react";

const PrintablePhases = React.forwardRef(({ phases, locked, difficulties }, ref) => (
  <div ref={ref} className="printable-container">
    <h2>Phase 10 List</h2>
    <ol>
      {phases.map((phase, i) => (
        <li key={i}>
          <strong>Phase {i + 1}</strong>: {phase}
          <br />
          Difficulty: {difficulties[i]}
          {locked[i] && <span> 🔒 Locked</span>}
        </li>
      ))}
    </ol>
  </div>
));

export default PrintablePhases;
