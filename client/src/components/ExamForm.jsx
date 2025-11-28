import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ExamForm() {
  const [profs, setProfs] = useState([]);
  const [salles, setSalles] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveaux, setNiveaux] = useState([]);

  const [isTroncCommun, setIsTroncCommun] = useState(false);

  const [form, setForm] = useState({
    date: '', heureDebut: '08:00', heureFin: '10:00',
    professeurId: '', salleId: '', matiereId: '', filiereId: '', niveauId: ''
  });

  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/professeurs').then(r => setProfs(r.data));
    api.get('/salles').then(r => setSalles(r.data));
    api.get('/matieres').then(r => setMatieres(r.data));
    api.get('/filieres').then(r => setFilieres(r.data));
    api.get('/niveaux').then(r => setNiveaux(r.data));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setMsg('');

    // Validation supplémentaire si la matière n'est pas tronc commun
    if (!isTroncCommun && (!form.filiereId || !form.niveauId)) {
      setMsg("Veuillez sélectionner la filière et le niveau pour les matières non tronc commun.");
      return;
    }

    // Vérification des conflits avant ajout
    try {
      const checkPayload = {
        professeur: Number(form.professeurId),
        salle: Number(form.salleId),
        date: form.date,
        heure_debut: form.heureDebut,
        heure_fin: form.heureFin
      };
      const checkRes = await api.post('/examens/check-conflict', checkPayload);
      if (checkRes.data.conflict) {
        setMsg(`Conflit: ${checkRes.data.message}`);
        return;
      }
    } catch (err) {
      setMsg('Erreur lors de la vérification du conflit.');
      return;
    }

    // Ajout de l'examen si pas de conflit
    try {
      const payload = {
        id :SVGAnimatedInteger,
        date: form.date,
        heureDebut: form.heureDebut,
        heureFin: form.heureFin,
        professeurId: Number(form.professeurId),
        salleId: Number(form.salleId),
        matiereId: Number(form.matiereId),
        filiereId: isTroncCommun ? null : (form.filiereId ? Number(form.filiereId) : null),
        niveauId: isTroncCommun ? null : (form.niveauId ? Number(form.niveauId) : null)
      };
      const res = await api.post('/examens', payload);
      setMsg('Examen créé ✅');
      console.log(res.data);
    } catch (err) {
      const text = err.response?.data?.message || (err.response?.data?.error ? JSON.stringify(err.response.data) : 'Erreur');
      setMsg(`Erreur: ${text}`);
    }
  }

  return (
    <div>
      <h2>Créer un examen</h2>
      <form onSubmit={submit} className="card">
    <label>id
        <input type="text" value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} required />
      </label>
        
        <label>Date
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
        </label>

        <label>Heure début
          <input type="time" value={form.heureDebut} onChange={e => setForm({ ...form, heureDebut: e.target.value })} required />
        </label>

        <label>Heure fin
          <input type="time" value={form.heureFin} onChange={e => setForm({ ...form, heureFin: e.target.value })} required />
        </label>

        <label>Matière
          <select
            value={form.matiereId}
            onChange={e => {
              const selectedId = e.target.value;
              const selectedMatiere = matieres.find(m => m.id === Number(selectedId));
              setForm({ ...form, matiereId: selectedId });
              setIsTroncCommun(selectedMatiere?.is_tronc_commun || false);
            }}
            required
          >
            <option value="">-- choisir --</option>
            {matieres.map(m => (
              <option key={m.id} value={m.id}>
                {m.nom} {m.is_tronc_commun ? '(Tronc commun)' : ''}
              </option>
            ))}
          </select>
        </label>

        <label>Professeur
  <select value={form.professeurId} onChange={e => setForm({ ...form, professeurId: e.target.value })} required>
            <option value="">-- choisir --</option>
            {profs.map(p => (
              <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>
            ))}
          </select>
        </label>

        <label>Salle
          <select value={form.salleId} onChange={e => setForm({ ...form, salleId: e.target.value })} required>
            <option value="">-- choisir --</option>
            {salles.map(s => (
              <option key={s.id} value={s.id}>{s.code} - {s.nom}</option>
            ))}
          </select>
        </label>

        <label>Filière (laissez vide si tronc commun)
          <select
            value={form.filiereId}
            onChange={e => setForm({ ...form, filiereId: e.target.value })}
            disabled={isTroncCommun}
          >
            <option value="">-- aucune --</option>
            {filieres.map(f => (
              <option key={f.id} value={f.id}>{f.code} - {f.nom}</option>
            ))}
          </select>
        </label>

        <label>Niveau (laissez vide si tronc commun)
          <select
            value={form.niveauId}
            onChange={e => setForm({ ...form, niveauId: e.target.value })}
            disabled={isTroncCommun}
          >
            <option value="">-- aucun --</option>
            {niveaux.map(n => {
              const filiere = filieres.find(f => f.id === n.filiere_id);
              return (
                <option key={n.id} value={n.id}>
                  {n.code} {filiere ? `(filière ${filiere.code})` : ''}
                </option>
              );
            })}
          </select>
        </label>

        <button type="submit">Créer</button>
        {msg && <p className="info">{msg}</p>}
      </form>
    </div>
  );
}

// Exemple de fonction pour vérifier les conflits avant d'ajouter un examen

async function handleAddExamen(e) {
  e.preventDefault();

  // Récupère les valeurs du formulaire
  const examen = {
    date,
    heure_debut,
    heure_fin,
    professeur_id,
    salle_id
  };

  // Vérifie les conflits AVANT d'ajouter
  const res = await api.post('/examens/check-conflict', examen);
  if (res.data.conflict) {
    alert(res.data.message); // Affiche le message de conflit
    return;
  }

  // Pas de conflit, on peut ajouter l'examen
  await api.post('/examens', examen);
  alert("Examen ajouté !");
}

// import React, { useState } from "react";
// import axios from "axios";

function ExamenForm() {
  const [examen, setExamen] = useState({
    date: "",
    heure_debut: "",
    heure_fin: "",
    professeur_id: "",
    salle_id: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setExamen({ ...examen, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post("/api/examens/check-conflict", examen);
      setResult(response.data);
    } catch (error) {
      setResult({ conflict: true, message: "Erreur serveur : " + error.message });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>Vérification des conflits d'examen</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input type="date" name="date" value={examen.date} onChange={handleChange} required />
        </div>
        <div>
          <label>Heure début:</label>
          <input type="time" name="heure_debut" value={examen.heure_debut} onChange={handleChange} required />
        </div>
        <div>
          <label>Heure fin:</label>
          <input type="time" name="heure_fin" value={examen.heure_fin} onChange={handleChange} required />
        </div>
        <div>
          <label>ID Professeur:</label>
          <input type="text" name="professeur_id" value={examen.professeur_id} onChange={handleChange} required />
        </div>
        <div>
          <label>ID Salle:</label>
          <input type="text" name="salle_id" value={examen.salle_id} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Vérification..." : "Vérifier conflit"}
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: result.conflict ? "#f8d7da" : "#d4edda",
            color: result.conflict ? "#721c24" : "#155724",
            borderRadius: "5px",
          }}
        >
          {result.message}
        </div>
      )}
    </div>
  );
}

export { ExamenForm };