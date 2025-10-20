import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    libelle: "",
    type: "",
    bloc: "",
    capacite: "",
    disponible: true,
    equipements: "",
  });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const navigate = useNavigate();

  // 🔄 Récupérer les salles
  const fetchRooms = async () => {
    try {
      const response = await api.get("/salles");
      setRooms(Object.values(response.data));
    } catch (error) {
      console.error("Erreur lors de la récupération des salles :", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 🔧 Modifier les champs du formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 💾 Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoomId) {
        await api.put(`/salles/${editingRoomId}`, formData);
      } else {
        await api.post("/salles", formData);
      }
      setShowForm(false);
      setFormData({
        libelle: "",
        type: "",
        bloc: "",
        capacite: "",
        disponible: true,
        equipements: "",
      });
      setEditingRoomId(null);
      fetchRooms();
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);
    }
  };

  // ✏️ Éditer une salle
  const handleEdit = (room) => {
    setFormData(room);
    setEditingRoomId(room.id);
    setShowForm(true);
  };

  // ❌ Supprimer une salle
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous supprimer cette salle ?")) {
      try {
        await api.delete(`/salles/${id}`);
        fetchRooms();
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  return (
    <div className="section">
      <h2 className="form-title">GESTION DES SALLES</h2>

      <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>
        Ajouter une salle
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 border p-3 rounded">
          <div className="row">
            <div className="col-md-4">
              <input
                type="text"
                name="libelle"
                placeholder="Libellé"
                className="form-control"
                value={formData.libelle}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                name="type"
                placeholder="Type"
                className="form-control"
                value={formData.type}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                name="bloc"
                placeholder="Bloc"
                className="form-control"
                value={formData.bloc}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-md-3">
              <input
                type="number"
                name="capacite"
                placeholder="Capacité"
                className="form-control"
                value={formData.capacite}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                name="equipements"
                placeholder="Équipements (séparés par virgule)"
                className="form-control"
                value={formData.equipements}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3 form-check d-flex align-items-center">
              <input
                type="checkbox"
                name="disponible"
                className="form-check-input me-2"
                checked={formData.disponible}
                onChange={handleChange}
              />
              <label className="form-check-label">Disponible</label>
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-success me-2" type="submit">
              {editingRoomId ? "Modifier" : "Créer"}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingRoomId(null);
                setFormData({
                  libelle: "",
                  type: "",
                  bloc: "",
                  capacite: "",
                  disponible: true,
                  equipements: "",
                });
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Libellé</th>
              <th>Type</th>
              <th>Bloc</th>
              <th>Capacité</th>
              <th>Équipements</th>
              <th>Disponible</th>
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
                <td>{room.equipements}</td>
                <td>{room.disponible ? "✅" : "❌"}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm"
                    onClick={() =>
                      navigate(`/salle/${encodeURIComponent(room.nom)}`)
                    }
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-warning btn-sm mx-1"
                    onClick={() => handleEdit(room)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(room.id)}
                  >
                    <i className="bi bi-trash"></i>
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
