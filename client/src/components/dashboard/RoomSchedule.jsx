import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../api';

const RoomSchedule = ({ roomName = 'Amphi A', onBack }) => {
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/salles');
        console.log(response.data);
        // You can use this data later if needed.
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="room-schedule" className="section">
      <h2 className="form-title">
        EMPLOI DU TEMPS SALLE: <span>{roomName}</span>
      </h2>

      <div className="schedule-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Jours/Horaires</th>
              <th>08:00-09:30</th>
              <th>09:30-11:00</th>
              <th>11:00-12:30</th>
              <th>12:30-14:00</th>
              <th>14:00-15:30</th>
              <th>15:30-17:00</th>
            </tr>
          </thead>
          <tbody>
            {/* You can dynamically generate these based on data if needed */}
            <tr>
              <td className="time-cell">Samedi</td>
              <td>
                <div className="schedule-item">
                  Formation: GI<br />
                  Module: mobilité<br />
                  Prof: Mr Ahmad<br />
                  Groupe: Amphi B
                </div>
              </td>
              <td></td>
              <td colSpan="5"></td>
            </tr>
            <tr>
              <td className="time-cell">Vendredi</td>
              <td colSpan="6"></td>
            </tr>
            <tr>
              <td className="time-cell">Lundi</td>
              <td>
                <div className="schedule-item">
                  Formation: GE<br />
                  Module: VHDL<br />
                  Prof: Boukhari Mht Issa<br />
                  Groupe: Salle 4
                </div>
              </td>
              <td colSpan="5"></td>
            </tr>
            {/* Add more days as needed */}
          </tbody>
        </table>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="btn" onClick={handlePrint}>
            <i className="fas fa-print"></i> Imprimer
          </button>
          <button
            className="btn"
            style={{ backgroundColor: '#666', marginLeft: '10px' }}
            onClick={onBack}
          >
            Précédent
          </button>
        </div>
      </div>
    </div>
  );
};

RoomSchedule.propTypes = {
  roomName: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default RoomSchedule;
