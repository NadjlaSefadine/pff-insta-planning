import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
// import './ModuleManagement.css'; // Optionnel pour tes styles

const initialModules = [
  { formation: 'GE', semestre: 'S2', nom: 'Capteur', volumeHoraire: 80 },
  { formation: 'GEn', semestre: 'S1', nom: 'MDF', volumeHoraire: 70 },
  { formation: 'GI', semestre: 'S1', nom: 'mobilité', volumeHoraire: 60 },
  { formation: 'GE', semestre: 'S2', nom: 'VHDL', volumeHoraire: 45 }
];

const formations = ['', 'GE', 'GEn', 'GI'];
const semestres = ['', 'S1', 'S2'];
const modules = ['', 'Capteur', 'MDF', 'mobilité', 'VHDL'];

const ModuleManagement = () => {
  const [search, setSearch] = useState({
    formation: '',
    semestre: '',
    module: ''
  });

  const [filteredModules, setFilteredModules] = useState(initialModules);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSearch(prev => ({ ...prev, [id]: value }));
  };

  const handleSearch = () => {
    const results = initialModules.filter(mod =>
      (search.formation === '' || mod.formation === search.formation) &&
      (search.semestre === '' || mod.semestre === search.semestre) &&
      (search.module === '' || mod.nom === search.module)
    );
    setFilteredModules(results);
  };
  const ModuleManagement = () => {
    const [modules, setModules] = useState([]);
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterFormation, setFilterFormation] = useState('all');
    const [filterSemester, setFilterSemester] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [formations, setFormations] = useState([]);
    const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    api.get('/formation').then(r => setFormation(r.data));
    api.get('/semestre').then(r => setSemestre(r.data));
    api.get('/module').then(r => setModule(r.data));
  }, []);
  console.log("filteredModules", filteredModules);
  return (
    <div className="section">
      <h2 className="form-title">GESTION DES MODULES</h2>

      <div className="form-container">
        <h3>RECHERCHER UN MODULE</h3>
        <div className="form-row">
          <div className="form-col">
            <label htmlFor="formation">Formation</label>
            <select id="formation" value={search.formation} onChange={handleChange}>
              {formations.map(f => (
                <option key={f} value={f}>{f || 'Toutes'}</option>
              ))}
            </select>
          </div>

          <div className="form-col">
            <label htmlFor="semestre">Semestre</label>
            <select id="semestre" value={search.semestre} onChange={handleChange}>
              {semestres.map(s => (
                <option key={s} value={s}>{s || 'Tous'}</option>
              ))}
            </select>
          </div>

          <div className="form-col">
            <label htmlFor="module">Module</label>
            <select id="module" value={search.module} onChange={handleChange}>
              {modules.map(m => (
                <option key={m} value={m}>{m || 'Tous'}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn" onClick={handleSearch}>Rechercher</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Formation</th>
              <th>Semestre</th>
              <th>Module</th>
              <th>Volume horaire</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.length > 0 ? (
              filteredModules.map((mod, index) => (
                <tr key={index}>
                  <td>{mod.formation}</td>
                  <td>{mod.semestre}</td>
                  <td>{mod.nom}</td>
                  <td>{mod.volumeHoraire}</td>
                  <td>
                    <button className="action-btn edit-btn">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="action-btn delete-btn">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Aucun module trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
}
export default ModuleManagement;
