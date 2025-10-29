import React, { useState } from 'react';
import api from '../api';
import { saveToken } from '../auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      console.log('Submitting login for', email);
      console.log('API base URL:', api.defaults.baseURL);
      const res = await api.post('/auth/login', { email, password });
      saveToken(res.data.token);
      window.location.href = '/';
    } catch (error) {
      setErr(error.response?.data?.message || 'Erreur connexion');
    }
  }

  return (
    <div className="container">
      <div id="login-page" className="login-container">
        <h2>Connexion</h2>
        {err && <div className="error">{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" placeholder="Votre email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Votre mot de passe" />
          </div>
          <button className="btn btn-block" type="submit">Se connecter</button>
        </form>
      </div>
      {/* <div className="card">
        <h2>Connexion</h2>
        {err && <div className="error">{err}</div>}
        <form onSubmit={handleSubmit}>
          <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
          <label>Mot de passe<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
          <button type="submit">Se connecter</button>
        </form>
      </div> */}
    </div>
  );
}