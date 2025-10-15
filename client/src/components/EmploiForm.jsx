import React, { useState, useEffect } from "react";

export default function EmploiForm() {
  const [semaine, setSemaine] = useState("");
  const [filiereId, setFiliereId] = useState("");
  const [niveauId, setNiveauId] = useState("");
  const [examens, setExamens] = useState([]);
  const [selectedExamens, setSelectedExamens] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/examens")
      .then(res => res.json())
      .then(data => setExamens(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { semaine, filiereId, niveauId, examens: selectedExamens };
    const res = await fetch("http://localhost:8000/api/emplois", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(data.message || "Emploi du temps créé !");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer un emploi du temps</h2>
      <label>
        Semaine :
        <input type="number" value={semaine} onChange={e => setSemaine(e.target.value)} required />
      </label>
      <label>
        Filière :
        <input type="number" value={filiereId} onChange={e => setFiliereId(e.target.value)} required />
      </label>
      <label>
        Niveau :
        <input type="number" value={niveauId} onChange={e => setNiveauId(e.target.value)} required />
      </label>
      <label>
        Sélectionner les examens :
        <select multiple value={selectedExamens} onChange={e => setSelectedExamens([...e.target.selectedOptions].map(o => o.value))}>
          {examens.map(exam => (
            <option key={exam.id} value={exam.id}>
              {exam.matiere} - {exam.date} {exam.heure_debut}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Créer</button>
    </form>
  );
}