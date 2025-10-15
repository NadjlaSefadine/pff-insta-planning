import React, { useState } from "react";
import "./Modules.css";

const initialModules = [
  { id: 1, formation: "GE3", semestre: "S6", libelle: "Capteur", volume: 20 },
  { id: 2, formation: "GI2", semestre: "S3", libelle: "Web", volume: 15 },
  {
    id: 3,
    formation: "GI1",
    semestre: "S2",
    libelle: "Structure des données",
    volume: 14,
  },
  { id: 4, formation: "GE2", semestre: "S4", libelle: "CCL", volume: 20 },
  { id: 5, formation: "GE2", semestre: "S1", libelle: "VHDL", volume: 12 },
  { id: 6, formation: "GE3", semestre: "S6", libelle: "Embarque", volume: 20 },
  {
    id: 7,
    formation: "GE1",
    semestre: "S1",
    libelle: "etude de realisation I",
    volume: 20,
  },
  {
    id: 8,
    formation: "GI",
    semestre: "S2",
    libelle: "Electronique numerique",
    volume: 20,
  },
  {
    id: 9,
    formation: "G(E,En,I)1",
    semestre: "S1",
    libelle: "langage C",
    volume: 20,
  },
];

function Modules() {
  const [modules, setModules] = useState(initialModules);
  const [search, setSearch] = useState("");

  // Filtrage modules
  const filtered = modules.filter((m) =>
    m.libelle.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setModules(modules.filter((m) => m.id !== id));
  };

  const handleEdit = (id) => {
    const libelle = prompt("Modifier le libellé du module :");
    if (libelle) {
      setModules(modules.map((m) => (m.id === id ? { ...m, libelle } : m)));
    }
  };

  return (
    <div className="modules-container">
      <h2>Gestion des Modules</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher un module"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="modules-table">
        <thead>
          <tr>
            <th>Libellé de formation</th>
            <th>Semestre</th>
            <th>Libellé de module</th>
            <th>Volume horaire</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((mod) => (
            <tr key={mod.id}>
              <td>{mod.formation}</td>
              <td>{mod.semestre}</td>
              <td>{mod.libelle}</td>
              <td>{mod.volume}</td>
              <td className="actions">
                <button
                  type="button"
                  className="btn btn-outline-warning mx-2"
                  onClick={() => handleEdit(mod.id)}
                  title="Modifier"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger mx-2"
                  onClick={() => handleDelete(mod.id)}
                  title="Supprimer"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="5" className="empty">
                Aucun module trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Modules;
