import React, { useEffect, useState } from 'react';
import api from '../../api';

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi','Vendredi','Samedi'];
const timeSlots = [
  '08:00-09:30',
  '09:30-11:00',
  '11:00-12:30',
  '12:30-14:00',
  '14:00-15:30',
  '15:30-17:00'
];

const TeacherAvailability = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [busySlots, setBusySlots] = useState([]);
  const [newTeacher, setNewTeacher] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      await api.get('/professeurs').then(r => {
        var result = Object.keys(r.data).map((key) => [key, r.data[key]]);
        setTeachers(result.map(item => ({ id: item[1].id, name: item[1].nom })));
      }).catch(console.error);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      api.get(`/emplois?prof=${selectedTeacher}`)
        .then(res => setBusySlots(res.data))
        .catch(() => setBusySlots([]));
    } else {
      setBusySlots([]);
    }
  }, [selectedTeacher]);

  const handleSelect = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!newTeacher) return;
  
    try {
      const token = localStorage.getItem('token'); // Récupérer le token stocké
  
      await api.post(
        '/professeurs',
        { nom: newTeacher, email: '' }, // Si email n’est pas obligatoire, tu peux laisser vide
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token dans l’en-tête
          },
        }
      );
  
      setMessage("Enseignant ajouté !");
      setNewTeacher('');
  
      // Recharge la liste des professeurs
      const r = await api.get('/professeurs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      var result = Object.keys(r.data).map((key) => [key, r.data[key]]);
      setTeachers(result.map(item => ({ id: item[1].id, name: item[1].nom })));
  
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l'ajout");
    }
  };
  

  return (
    <div className="section">
      <h2 className="form-title">DISPONIBILITÉ DES ENSEIGNANTS</h2>

      <form onSubmit={handleAddTeacher} style={{ marginBottom: 16 }}>
        <label>
          Ajouter un enseignant :
          <input
            type="text"
            value={newTeacher}
            onChange={e => setNewTeacher(e.target.value)}
            style={{ marginLeft: 8, marginRight: 16 }}
            placeholder="Nom"
          />
        </label>
        <label>
          Email :
          <input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            style={{ marginLeft: 8 }}
            placeholder="email@example.com"
          />
        </label>
        <button type="submit" style={{ marginLeft: 8 }}>Ajouter</button>
      </form>

      {message && <div style={{ color: message.includes('Erreur') ? 'red' : 'green', marginBottom: 8 }}>{message}</div>}

      <div className="form-container">
        <div className="form-row">
          <div className="form-col">
            <label htmlFor="teacher-select">Sélectionner un enseignant</label>
            <select id="teacher-select" value={selectedTeacher} onChange={handleSelect}>
              <option value="">Sélectionner</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedTeacher && (
        <div className="schedule-container">
          <h3 className="schedule-title">
            Disponibilité de : <span className="teacher-name">{selectedTeacher}</span>
          </h3>

          <table className="schedule-table">
            <thead>
              <tr>
                <th>JOUR / HEURE</th>
                {timeSlots.map((slot, idx) => (
                  <th key={idx}>{slot}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day, dayIdx) => (
                <tr key={dayIdx}>
                  <td className="time-cell">{day}</td>
                  {timeSlots.map((slot, slotIdx) => {
                    const isBusy = busySlots.some(
                      b => b.day === day && b.slot === slot
                    );
                    return (
                      <td
                        key={slotIdx}
                        style={{
                          background: isBusy ? "#fbb" : "#fff",
                          textAlign: "center"
                        }}
                      >
                        {isBusy ? "Conflit" : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherAvailability;
