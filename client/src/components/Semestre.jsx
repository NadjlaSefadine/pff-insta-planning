import React, { useState } from 'react';
import './Semestre.css'; // si tu veux styliser

const Semestre = () => {
  const [nom, setNom] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const semestre = {
      nom,
      dateDebut,
      dateFin,
    };

    console.log('Semestre créé :', semestre);

    // 🔁 Tu peux ici faire un POST vers ton backend :
    /*
    fetch('http://localhost:8000/api/semestres/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(semestre)
    })
    .then(res => res.json())
    .then(data => console.log('Réponse backend :', data))
    .catch(err => console.error('Erreur ajout semestre', err));
    */

    // Réinitialiser les champs
    setNom('');
    setDateDebut('');
    setDateFin('');
  };

  return (
    <div className="semestre-container">
      <h2>Créer un Semestre</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom du semestre :</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Date de début :</label>
          <input
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Date de fin :</label>
          <input
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            required
          />
        </div>

        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default Semestre;
