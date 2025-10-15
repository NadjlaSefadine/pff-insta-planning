import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ProfessorsList(){
  const [items, setItems] = useState([]);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => { api.get('api/professeurs').then(r=>setItems(r.data)).catch(console.error); }, []);

  async function createProf(e){
    e.preventDefault();
    try {
      const res = await api.post('/professeurs', { nom, email });
      setItems(s => [...s, res.data]);
      setNom(''); setEmail('');
    } catch (err) { alert(err.response?.data?.message || 'Erreur'); }
  }

  return (
    <div>
      <h2>Professeurs</h2>
      <form onSubmit={createProf} className="inline-form">
        <input placeholder="Nom" value={nom} onChange={e=>setNom(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <button type="submit">Ajouter</button>
      </form>

      <ul>
        {items.map(p => (
          <li key={p.id}>{p.nom} — {p.email}</li>
        ))}
      </ul>
    </div>
  );
}