import React, { useState } from 'react';

const TimetableCreator = ({ onBack }) => {
  const [visible, setVisible] = useState(true); // afficher/masquer la section

  const formation = 'GE';
  const semestre = 'S2';
  const section = 'section 1';
  const groupe = 'B1';

  const timeSlots = [
    '08:00-09:30',
    '09:30-11:00',
    '11:00-12:30',
    '12:30-14:00',
    '14:00-15:30',
    '15:30-17:00'
  ];

  const days = ['Samedi', 'Vendredi', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];

  const handleClearAll = () => {
    // Implémente ta logique de réinitialisation ici
    alert('Réinitialisation de tout le planning.');
  };

  return (
    visible && (
      <div id="creer-edt" className="section timetable-creator">
        <div className="topbar">
          <h2>CRÉER UN EMPLOI DU TEMPS</h2>
          <button className="previous-btn" onClick={onBack}>
            Précédent
          </button>
        </div>

        <div className="meta" aria-label="informations">
          <div>FORMATION : <b>{formation}</b></div>
          <div>SEMESTRE : <b>{semestre}</b></div>
          <div>SECTION : <b>{section}</b></div>
          <div>GROUPE : <b>{groupe}</b></div>
        </div>

        <hr style={{ margin: '14px 0 20px', border: 'none', borderTop: '1px solid #eee' }} />

        <div className="timetable" id="timetable" role="table" aria-label="emploi du temps">
          {/* Cellule vide en haut à gauche */}
          <div></div>

          {/* Entêtes horaires */}
          {timeSlots.map((slot, index) => (
            <div key={`slot-${index}`} className="time-header">{slot}</div>
          ))}

          {/* Lignes par jour */}
          {days.map((day) => (
            <React.Fragment key={day}>
              <div className="day-name">{day}</div>
              {timeSlots.map((_, i) => (
                <div
                  key={`${day}-${i}`}
                  className="cell"
                  data-day={day}
                  data-slot={i}
                ></div>
              ))}
            </React.Fragment>
          ))}
        </div>

        <button
          id="clear-all-btn"
          className="btn"
          style={{ marginTop: '20px', backgroundColor: '#d9534f' }}
          onClick={handleClearAll}
        >
          Réinitialiser tout
        </button>
      </div>
    )
  );
};

export default TimetableCreator;
