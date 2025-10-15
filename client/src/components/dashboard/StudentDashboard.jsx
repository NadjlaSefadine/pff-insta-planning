import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import api from '../../api';
// import './StudentDashboard.css'; // Assure-toi d’avoir les styles nécessaires ici    
const StudentDashboard = () => {
  const [student, setStudent] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    async function fetchData() {
      await api.get('/etudiant').then(r => {
        console.log(typeof (r.data));
        console.log(r.data);
        var result = Object.keys(r.data).map((key) => [key, r.data[key]]);
        setTeachers(result.map(item => ({ id: item[1].id, name: item[1].nom })));
      }).catch(console.error);
    }
    fetchData();
  }, []);

const StudentDashboard = () => {
  return (
    <div id="student-dashboard" className="dashboard">
      <div className="welcome-message">
        <h2>Espace Étudiant</h2>
        <p>Bienvenue Nadjla Sefadine Dans Votre Espace</p>
      </div>

      <div className="menu">
        <div className="menu-item">
          <i className="fas fa-calendar-alt"></i>
          <h3>EMPLOI DU TEMPS</h3>
        </div>
        <div className="menu-item">
          <i className="fas fa-cog"></i>
          <h3>PARAMÈTRE</h3>
        </div>
      </div>
    </div>
  );
};
}
export default StudentDashboard;
