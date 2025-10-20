import React, { useState } from "react";
// import './ScheduleManager.css'; // Si tu as une feuille de style externe

const ScheduleManager = () => {
  const [formation, setFormation] = useState("");
  const [semestre, setSemestre] = useState("");
  const [section, setSection] = useState("");
  const [groupe, setGroupe] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);

  const handleShowSchedule = () => {
    if (formation && semestre && section && groupe) {
      setShowSchedule(true);
    } else {
      alert("Veuillez sélectionner tous les champs.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const onBack = () => {
    window.history.back();
  };

  return (
    <div id="emploi-du-temps" className="section">
      <h2 className="form-title">GESTION DES EMPLOIS DU TEMPS</h2>

      <div className="form-container">
        <div className="form-row">
          <div className="form-col">
            <label htmlFor="formation-schedule">Formation</label>
            <select
              id="formation-schedule"
              value={formation}
              onChange={(e) => setFormation(e.target.value)}
            >
              <option value="">Sélectionner</option>
              <option value="GE">GE</option>
              <option value="GEn">GEn</option>
              <option value="GI">GI</option>
            </select>
          </div>
          <div className="form-col">
            <label htmlFor="semestre-schedule">Semestre</label>
            <select
              id="semestre-schedule"
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
            >
              <option value="">Sélectionner</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
            </select>
          </div>
          <div className="form-col">
            <label htmlFor="section-schedule">Section</label>
            <select
              id="section-schedule"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              <option value="">Sélectionner</option>
              <option value="section 1">section 1</option>
              <option value="section 2">section 2</option>
            </select>
          </div>
          <div className="form-col">
            <label htmlFor="groupe-schedule">Groupe</label>
            <select
              id="groupe-schedule"
              value={groupe}
              onChange={(e) => setGroupe(e.target.value)}
            >
              <option value="">Sélectionner</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
            </select>
          </div>
        </div>
        <button className="btn" onClick={handleShowSchedule}>
          Afficher l'emploi du temps
        </button>
      </div>

      {showSchedule && (
        <div className="schedule-container">
          <h3 className="schedule-title">
            Emploi du temps ({semestre}) de la spécialité{" "}
            <span>{formation}</span> section <span>{section}</span> (
            <span>{groupe}</span>)
          </h3>

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
              <tr>
                <td className="time-cell">Samedi</td>
                <td>
                  <div className="schedule-item">
                    Module: Capteur
                    <br />
                    Type: Cours
                    <br />
                    Prof: Boukhari Mht Issa
                    <br />
                    Salle: Amphi A
                  </div>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <div className="schedule-item">
                    Module: Capteur
                    <br />
                    Type: Cours
                    <br />
                    Prof: Boukhari Mht Issa
                    <br />
                    Salle: S4
                  </div>
                </td>
                <td></td>
              </tr>
              <tr>
                <td className="time-cell">Vendredi</td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <div className="schedule-item">
                    Module: GEn
                    <br />
                    Type: Cours
                    <br />
                    Prof: Mr Ahmad
                    <br />
                    Salle: Amphi B
                  </div>
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="time-cell">Lundi</td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <div className="schedule-item">
                    Module: Capteur
                    <br />
                    Type: TP
                    <br />
                    Prof: Boukhari Mht Issa
                    <br />
                    Salle: Labo1
                  </div>
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="time-cell">Mardi</td>
                <td>
                  <div className="schedule-item">
                    Module: GEn
                    <br />
                    Type: TD
                    <br />
                    Prof: Dr Mht Saleh
                    <br />
                    Salle: S1
                  </div>
                </td>
                <td></td>
              </tr>
              <tr>
                <td className="time-cell">Mercredi</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="time-cell">Jeudi</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button className="btn" onClick={handlePrint}>
              <i className="fas fa-print"></i> Imprimer
            </button>
            <button
              className="btn"
              style={{ backgroundColor: "#666", marginLeft: "10px" }}
              onClick={onBack}
            >
              Précédent
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManager;
