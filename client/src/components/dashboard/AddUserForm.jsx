import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../api'; // Make sure this path is correct

const initialFormData = {
  civilite: 'M.',
  nom: '',
  prenom: '',
  tel: '',
  email: '',
  login: '',
  password: '',
  profil: 'Admin'
};

const AddUserForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // for success or error feedback

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const isFormValid = () =>
    formData.nom.trim() &&
    formData.prenom.trim() &&
    formData.login.trim() &&
    formData.password.trim() &&
    formData.email.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const response = await api.post('/utilisateurs', formData);

      if (response.status === 201 || response.status === 200) {
        setMessage({ type: 'success', text: 'Utilisateur ajouté avec succès !' });
        setFormData(initialFormData); // reset form
      } else {
        setMessage({ type: 'error', text: 'Une erreur est survenue. Réessayez.' });
      }

    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: "Erreur lors de l'ajout de l'utilisateur." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">AJOUTER UN UTILISATEUR</h2>

      {message && (
        <div
          style={{
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-col">
            <label htmlFor="civilite">Civilité</label>
            <select id="civilite" value={formData.civilite} onChange={handleChange}>
              <option value="M.">M.</option>
              <option value="Mme.">Mme.</option>
              <option value="Mlle.">Mlle.</option>
              <option value="Ing.">Ing.</option>
              <option value="Dr.">Dr.</option>
              <option value="Pr.">Pr.</option>
            </select>
          </div>
          <div className="form-col">
            <label htmlFor="nom">Nom</label>
            <input type="text" id="nom" value={formData.nom} onChange={handleChange} required />
          </div>
          <div className="form-col">
            <label htmlFor="prenom">Prénom</label>
            <input type="text" id="prenom" value={formData.prenom} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label htmlFor="tel">Téléphone</label>
            <input type="tel" id="tel" value={formData.tel} onChange={handleChange} />
          </div>
          <div className="form-col">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-col">
            <label htmlFor="login">Login</label>
            <input type="text" id="login" value={formData.login} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label htmlFor="password">Mot de passe</label>
            <input type="password" id="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-col">
            <label htmlFor="profil">Profil</label>
            <select id="profil" value={formData.profil} onChange={handleChange}>
              <option value="Admin">Admin</option>
              <option value="prof">Enseignant</option>
              <option value="Etudiant">Etudiant</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button className="btn" type="submit" disabled={!isFormValid()}>
            {loading ? 'Ajout en cours...' : 'Ajouter'}
          </button>
          <button
            type="button"
            className="btn"
            style={{ backgroundColor: '#666', marginLeft: '10px' }}
            onClick={back => window.history.back()}
          >
            Retour
          </button>
        </div>
      </form>
    </div>
  );
};

// AddUserForm.propTypes = {
//   onCancel: PropTypes.func.isRequired
// };

export default AddUserForm;
