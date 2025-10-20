import React, { useEffect, useState } from "react";
import api from "../../api";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const timeSlots = [
  "08:00-09:30",
  "09:30-11:00",
  "11:00-12:30",
  "12:30-14:00",
  "14:00-15:30",
  "15:30-17:00",
];

const TeacherAvailability = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [busySlots, setBusySlots] = useState([]);
  const [newTeacher, setNewTeacher] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      await api
        .get("/professeurs")
        .then((r) => {
          var result = Object.keys(r.data).map((key) => [key, r.data[key]]);
          setTeachers(
            result.map((item) => ({ id: item[1].id, name: item[1].nom }))
          );
        })
        .catch(console.error);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      api
        .get(`/emplois?prof=${selectedTeacher}`)
        .then((res) => setBusySlots(res.data))
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
      console.log("Adding teacher:", newTeacher);

      const token = localStorage.getItem("token"); // Récupérer le token stocké

      await api.post(
        "/professeurs",
        {
          nom: newTeacher,
          email: newEmail,
          password: newPassword,
          confirmPassword,
        }, // Si email n’est pas obligatoire, tu peux laisser vide
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token dans l’en-tête
          },
        }
      );

      setMessage("Enseignant ajouté !");
      setNewTeacher("");

      // Recharge la liste des professeurs
      const r = await api.get("/professeurs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      var result = Object.keys(r.data).map((key) => [key, r.data[key]]);
      setTeachers(
        result.map((item) => ({ id: item[1].id, name: item[1].nom }))
      );
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l'ajout");
    }
  };

  return (
    <div className="section">
      <h2 className="form-title">DISPONIBILITÉ DES ENSEIGNANTS</h2>

      <form onSubmit={handleAddTeacher} className="mb-4 border p-3 rounded">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="nom" className="form-label">
              Nom
            </label>
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              className="form-control"
              value={newTeacher}
              onChange={(e) => setNewTeacher(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="mt-3">
            <button className="btn btn-success me-2" type="submit">
              Ajouter
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              value={newEmail}
              onClick={() => {
                setNewTeacher("");
                setNewEmail("");
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      </form>

      {message && (
        <div
          style={{
            color: message.includes("Erreur") ? "red" : "green",
            marginBottom: 8,
          }}
        >
          {message}
        </div>
      )}

      <div className="form-container">
        {/* <div className="form-row"> */}
        <div className="mb-3">
          <label htmlFor="teacher-select" className="form-label">
            Sélectionner un enseignant
          </label>
          <select
            id="teacher-select"
            value={selectedTeacher}
            onChange={handleSelect}
            className="form-select"
          >
            <option value="">Sélectionner</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        {/* </div> */}
      </div>

      {selectedTeacher && (
        <div className="schedule-container">
          <h3 className="schedule-title">
            Disponibilité de :{" "}
            <span className="teacher-name">{selectedTeacher}</span>
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
                      (b) => b.day === day && b.slot === slot
                    );
                    return (
                      <td
                        key={slotIdx}
                        style={{
                          background: isBusy ? "#fbb" : "#fff",
                          textAlign: "center",
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
