import React, { useState } from 'react';
// import './UserManagement.css'; // Pour les styles éventuels
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const usersMock = [
  {
    civilite: 'Dr',
    nom: 'Abderahman',
    prenom: 'Adoum',
    tel: '66 46 61 69',
    email: 'abderahman@gmail.com',
    login: 'admin',
    password: 'docteur',
    profil: 'prof'
  },
  {
    civilite: 'Pr',
    nom: 'Boukhari',
    prenom: 'Mht Issa',
    tel: '66 24 62 56',
    email: 'boukharimhtissa@gmail.com',
    login: 'karim12',
    password: 'Boukhari',
    profil: 'prof'
  },
  {
    civilite: 'Mme',
    nom: 'Nadjla',
    prenom: 'Sefadine',
    tel: '66970372',
    email: 'alzantoutienadjla@gmail.com',
    login: 'mass1',
    password: 'nazlie',
    profil: 'Etudiant'
  }
];

const UserManagement = () => {
  const [users, setUsers] = useState(usersMock);
  const [searchNom, setSearchNom] = useState('');
  const [searchPrenom, setSearchPrenom] = useState('');

  const handleSearch = () => {
    const filtered = usersMock.filter(user =>
      user.nom.toLowerCase().includes(searchNom.toLowerCase()) &&
      user.prenom.toLowerCase().includes(searchPrenom.toLowerCase())
    );
    setUsers(filtered);
  };

  const handleResetSearch = () => {
    setSearchNom('');
    setSearchPrenom('');
    setUsers(usersMock);
  };

  const handleAddUser = () => {
    // Implémentation du formulaire d'ajout ici
    console.log('Afficher le formulaire d’ajout');
  };

  return (
    <div id="utilisateur" className="section">
      <h2 className="form-title">GESTION DES UTILISATEURS</h2>
      
      <Link to="/add-user" className="btn add-btn">
      {/* <button className="btn add-btn" onClick={handleAddUser}> */}
        <FontAwesomeIcon icon={faPlus} /> Ajouter un utilisateur
      </Link>

      <div className="form-container">
        <h3>CHERCHER UN UTILISATEUR PAR SON NOM ET PRÉNOM</h3>
        <div className="form-row">
          <div className="form-col">
            <label htmlFor="search-nom">NOM</label>
            <input
              type="text"
              id="search-nom"
              value={searchNom}
              onChange={(e) => setSearchNom(e.target.value)}
            />
          </div>
          <div className="form-col">
            <label htmlFor="search-prenom">PRÉNOM</label>
            <input
              type="text"
              id="search-prenom"
              value={searchPrenom}
              onChange={(e) => setSearchPrenom(e.target.value)}
            />
          </div>
        </div>
        <button className="btn" onClick={handleSearch}>Rechercher</button>
        <button className="btn" style={{ backgroundColor: '#666', marginLeft: '10px' }} onClick={handleResetSearch}>
          Précédent
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Civilité</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Tel</th>
              <th>E-mail</th>
              <th>Login</th>
              <th>Password</th>
              <th>Profil</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx}>
                <td>{user.civilite}</td>
                <td>{user.nom}</td>
                <td>{user.prenom}</td>
                <td>{user.tel}</td>
                <td>{user.email}</td>
                <td>{user.login}</td>
                <td>{user.password}</td>
                <td>{user.profil}</td>
                <td>
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
