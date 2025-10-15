// Timetable.jsx
import React, { useState } from "react";
import "./Timetable.css";

const DEFAULT_MODULES = [
  "Choisir un module",
  "Maths",
  "Programmation",
  "Réseaux",
  "Électronique"
];

const DEFAULT_TYPES = ["Choisir un type", "Cours", "TP", "TD", "Examen"];
const DEFAULT_SALLE = ["Choisir une salle", "S101", "S102", "Lab1", "Amphi"];

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const TIMES = [
  "08:00-09:30",
  "09:30-11:00",
  "11:00-12:30",
  "12:30-14:00",
  "14:00-15:30",
  "15:30-17:00"
];

function Timetable({
  modules = DEFAULT_MODULES,
  types = DEFAULT_TYPES,
  salles = DEFAULT_SALLE,
  days = DAYS,
  times = TIMES
}) {
  // state: object keyed by `${day}_${timeIndex}` -> { module, type, salle, saved }
  const [cells, setCells] = useState(() => {
    const obj = {};
    days.forEach((d) => {
      times.forEach((_, tIdx) => {
        obj[`${d}_${tIdx}`] = { module: modules[0], type: types[0], salle: salles[0], saved: false };
      });
    });
    return obj;
  });

  const handleSelectChange = (day, tIdx, field, value) => {
    const key = `${day}_${tIdx}`;
    setCells((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const handleValidate = (day, tIdx) => {
    const key = `${day}_${tIdx}`;
    setCells((prev) => ({
      ...prev,
      [key]: { ...prev[key], saved: true }
    }));
  };

  const handleResetCell = (day, tIdx) => {
    const key = `${day}_${tIdx}`;
    setCells((prev) => ({
      ...prev,
      [key]: { module: modules[0], type: types[0], salle: salles[0], saved: false }
    }));
  };

  const exportJSON = () => {
    // Export only validated slots
    const validated = [];
    Object.entries(cells).forEach(([key, val]) => {
      if (val.saved) {
        const [day, tIdx] = key.split("_");
        validated.push({
          day,
          time: times[Number(tIdx)],
          module: val.module,
          type: val.type,
          salle: val.salle
        });
      }
    });
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(validated, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "emploi_du_temps.json");
    dlAnchor.click();
  };

  return (
    <div className="timetable-container">
      <div className="timetable-header">
        <h2>Créer un emploi du temps</h2>
        <div className="timetable-actions">
          <button onClick={exportJSON} className="btn export">Exporter JSON</button>
        </div>
      </div>

      <div className="timetable-grid">
        {/* top-left corner empty cell */}
        <div className="timetable-cell corner" />

        {/* time headers */}
        {times.map((time, idx) => (
          <div key={idx} className="timetable-cell time-header">
            {time}
          </div>
        ))}

        {/* rows by day */}
        {days.map((day) => (
          <React.Fragment key={day}>
            <div className="timetable-cell day-cell">{day}</div>

            {times.map((_, tIdx) => {
              const key = `${day}_${tIdx}`;
              const state = cells[key];
              return (
                <div key={key} className={`timetable-cell slot-cell ${state.saved ? "saved" : ""}`}>
                  <label className="small-label">
                    Module
                    <select
                      value={state.module}
                      onChange={(e) => handleSelectChange(day, tIdx, "module", e.target.value)}
                    >
                      {modules.map((m, i) => (
                        <option key={i} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="small-label">
                    Type
                    <select
                      value={state.type}
                      onChange={(e) => handleSelectChange(day, tIdx, "type", e.target.value)}
                    >
                      {types.map((t, i) => (
                        <option key={i} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="small-label">
                    Salle
                    <select
                      value={state.salle}
                      onChange={(e) => handleSelectChange(day, tIdx, "salle", e.target.value)}
                    >
                      {salles.map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="slot-actions">
                    <button
                      onClick={() => handleValidate(day, tIdx)}
                      className={`btn validate ${state.saved ? "disabled" : ""}`}
                      disabled={state.saved}
                    >
                      {state.saved ? "Validé" : "Valider"}
                    </button>
                    <button onClick={() => handleResetCell(day, tIdx)} className="btn reset">
                      Réinitialiser
                    </button>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Timetable;