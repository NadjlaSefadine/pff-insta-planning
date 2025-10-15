import React, { useState } from "react";
// import "./Disponibilite.css";

const jours = [  "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const heures = [
  "08:00-09:30",
  "09:30-11:00",
  "11:00-12:30",
  "12:30-14:00",
  "14:00-15:30",
  "15:30-17:00"
];

// 0 = vide, 1 = dispo (vert), 2 = non dispo (rouge)
function Disponibilite() {
  const [dispo, setDispo] = useState(
    Array(jours.length).fill().map(() => Array(heures.length).fill(0))
  );

  const toggleDispo = (j, h) => {
    setDispo((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[j][h] = (copy[j][h] + 1) % 3; 
      return copy;
    });
  };

  return (
    <div className="disponibilite-container">
      <h2>Disponibilité de : Dr. Boukhari</h2>
      <table className="disponibilite-table">
        <thead>
          <tr>
            <th>Jour / Heure</th>
            {heures.map((h, idx) => (
              <th key={idx}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jours.map((jour, j) => (
            <tr key={j}>
              <td className="jour">{jour}</td>
              {heures.map((_, h) => (
                <td
                  key={h}
                  className="case"
                  onClick={() => toggleDispo(j, h)}
                >
                  {dispo[j][h] === 1 && <span className="dispo vert">🟢</span>}
                  {dispo[j][h] === 2 && <span className="dispo rouge">🔴</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Disponibilite;