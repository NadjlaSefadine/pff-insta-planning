import React from 'react';

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi','Vendredi', 'Samedi'];
const timeSlots = [
  '08:00-09:30',
  '09:30-11:00',
  '11:00-12:30',
  '12:30-14:00',
  '14:00-15:30',
  '15:30-17:00',
];

const CreateSchedule = ({ formation = 'GE', semestre = 'S2', section = 'section 1', groupe = 'B1', onBack, onClear }) => {
  return (
    <div id="creer-edt" className="section timetable-creator">
      <div className="topbar">
        <h2>CRÉER UN EMPLOI DU TEMPS</h2>
        <button className="previous-btn" onClick={onBack}>Précédent</button>
      </div>

      <div className="meta" aria-label="informations">
        <div>FORMATION : <b>{formation}</b></div>
        <div>SEMESTRE : <b>{semestre}</b></div>
        <div>SECTION : <b>{section}</b></div>
        <div>Groupe : <b>{groupe}</b></div>
      </div>

      <hr style={{ margin: '14px 0 20px', border: 'none', borderTop: '1px solid #eee' }} />

      <div
        className="timetable"
        id="timetable"
        role="table"
        aria-label="emploi du temps"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${timeSlots.length + 1}, 1fr)`,
          gap: '5px',
          alignItems: 'center',
        }}
      >
        {/* Empty top-left cell */}
        <div></div>

        {/* Time headers */}
        {timeSlots.map((slot, i) => (
          <div key={i} className="time-header">{slot}</div>
        ))}

        {/* Rows: Days */}
        {days.map((day, dayIndex) => (
          <React.Fragment key={day}>
            <div className="day-name">{day}</div>
            {timeSlots.map((_, slotIndex) => (
              <div
                key={slotIndex}
                className="cell"
                data-day={day}
                data-slot={slotIndex}
                style={{
                  minHeight: '50px',
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                }}
                // Ici tu peux ajouter les événements au clic etc.
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      <button
        id="clear-all-btn"
        className="btn"
        style={{ marginTop: 20, backgroundColor: '#d9534f' }}
        onClick={onClear}
      >
        Réinitialiser tout
      </button>
    </div>
  );
};

export default CreateSchedule;
