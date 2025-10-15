import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../api';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/salles');
        const data = Object.values(response.data);
        setRooms(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="section">
      <h2 className="form-title">GESTION DES SALLES</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Libellé de la salle</th>
              <th>Type</th>
              <th>Bloc</th>
              <th>Capacité</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr key={index}>
                <td>{room.libelle}</td>
                <td>{room.type}</td>
                <td>{room.bloc}</td>
                <td>{room.capacite}</td>
                <td>
                  <button
                    className="action-btn view-btn"
                    onClick={() => navigate(`/salle/${encodeURIComponent(room.nom)}`)}
                  >
                    Afficher emploi du temps
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomManagement;