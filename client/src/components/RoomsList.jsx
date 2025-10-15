import React, { useEffect, useState } from 'react';
import api from '../api';

export default function RoomsList(){
  const [items, setItems] = useState([]);
  const [code, setCode] = useState('');
  const [cap, setCap] = useState(30);

  useEffect(() => { api.get('/salles').then(r=>setItems(r.data)).catch(console.error); }, []);

  async function createRoom(e){
    e.preventDefault();
    try {
      const res = await api.post('/salles', { code, capacite: cap });
      setItems(s => [...s, res.data]);
      setCode(''); setCap(30);
    } catch (err) { alert(err.response?.data?.message || 'Erreur'); }
  }

  return (
    <div>
      <h2>Salles</h2>
      <form onSubmit={createRoom} className="inline-form">
        <input placeholder="Code salle" value={code} onChange={e=>setCode(e.target.value)} required />
        <input type="number" placeholder="Capacité" value={cap} onChange={e=>setCap(e.target.value)} required />
        <button type="submit">Ajouter</button>
      </form>

      <ul>
        {items.map(s => (<li key={s.id}>{s.code} — {s.capacite} places</li>))}
      </ul>
    </div>
  );
}