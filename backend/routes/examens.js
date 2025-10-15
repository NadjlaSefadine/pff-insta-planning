const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();
const { checkConflicts } = require('../services/examen.service');
const { notifyProfesseur } = require('../services/notification.service');

// Création d'un examen
router.post('/', auth, async (req, res) => {
  const { date, heureDebut, heureFin, professeurId, salleId, matiereId, filiereId, niveauId } = req.body;

  try {
    // Vérifier conflit professeur
    const conflitProf = await db.query(`
      SELECT * FROM examens
      WHERE professeurid=$1 AND date=$2 AND NOT (heureFin <= $3 OR heureDebut >= $4)
    `, [professeurId, date, heureDebut, heureFin]);

    if (conflitProf.rows.length > 0)
      return res.status(409).json({ message: 'Conflit : le professeur est déjà occupé à cette heure' });

    // Vérifier conflit salle
    const conflitSalle = await db.query(`
      SELECT * FROM examens
      WHERE salleid=$1 AND date=$2 AND NOT (heureFin <= $3 OR heureDebut >= $4)
    `, [salleId, date, heureDebut, heureFin]);

    if (conflitSalle.rows.length > 0)
      return res.status(409).json({ message: 'Conflit : la salle est déjà occupée à cette heure' });

    // Création de l'examen
    const result = await db.query(`
      INSERT INTO examens (date, heureDebut, heureFin, professeurid, salleid, matiereid, filiereid, niveauid)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `, [date, heureDebut, heureFin, professeurId, salleId, matiereId, filiereId, niveauId]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
//

/**
 * GET /api/examens
 * Query params optionnels :
 *  - from, to (ISO dates)
 *  - professeurId, salleId, filiereId, niveauId
 *  - limit
 */
router.get('/', auth, async (req, res) => {
  try {
    const { from, to, professeurId, salleId, filiereId, niveauId, limit } = req.query;
    const filters = [];
    const params = [];

    let idx = 1;
    if (from) { filters.push(`e.date >= $${idx++}`); params.push(from); }
    if (to)   { filters.push(`e.date <= $${idx++}`); params.push(to); }
    if (professeurId) { filters.push(`e.professeurId = $${idx++}`); params.push(professeurId); }
    if (salleId) { filters.push(`e.salleId = $${idx++}`); params.push(salleId); }
    if (filiereId) { filters.push(`e.filiereId = $${idx++}`); params.push(filiereId); }
    if (niveauId) { filters.push(`e.niveauId = $${idx++}`); params.push(niveauId); }

    const where = filters.length ? 'WHERE ' + filters.join(' AND ') : '';

    const lim = limit ? `LIMIT ${Number(limit)}` : '';

    const sql = `
      SELECT e.*,
             m.nom AS matiere_nom, m.id AS matiere_id,
             p.nom AS professeur_nom, p.email AS professeur_email, p.id AS professeur_id,
             s.libelle AS salle_code, s.id AS salle_id,
             f.nom AS filiere_nom, f.id AS filiere_id,
             n.code AS niveau_nom, n.id AS niveau_id
      FROM examens e
      LEFT JOIN matieres m ON e.matiereId = m.id
      LEFT JOIN professeurs p ON e.professeurId = p.id
      LEFT JOIN salles s ON e.salleId = s.id
      LEFT JOIN filieres f ON e.filiereId = f.id
      LEFT JOIN niveaux n ON e.niveauId = n.id
      ${where}
      ORDER BY e.date, e.heureDebut
      ${lim}
    `;

    const result = await db.query(sql, params);
    console.log('GET /examens result count:', result.rows.length);
    
    res.json(result.rows);
  } catch (err) {
    console.error('GET /examens error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
  
});

/**
 * GET /api/examens/:id
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const sql = `
      SELECT e.*,
             m.nom AS matiere_nom,
             p.nom AS professeur_nom, p.email AS professeur_email,
             s.code AS salle_code,
             f.nom AS filiere_nom, n.nom AS niveau_nom
      FROM examens e
      LEFT JOIN matieres m ON e.matiereId = m.id
      LEFT JOIN professeurs p ON e.professeurId = p.id
      LEFT JOIN salles s ON e.salleId = s.id
      LEFT JOIN filieres f ON e.filiereId = f.id
      LEFT JOIN niveaux n ON e.niveauId = n.id
      WHERE e.id = $1
    `;
    const result = await db.query(sql, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Examen non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /examens/:id error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * POST /api/examens
 * - Si la matière est tronc_commun et qu'on n'a pas filiereId/niveauId,
 *   on duplique l'examen pour toutes les cibles définies dans matiere_filiere.
 */
router.post('/', auth, async (req, res) => {
  const { date, heureDebut, heureFin, professeurId, salleId, matiereId, filiereId, niveauId } = req.body;

  try {
    // Vérifier que la matière existe et si tronc commun
    const mat = await db.query('SELECT is_tronc_commun FROM matieres WHERE id = $1', [matiereId]);
    if (mat.rows.length === 0) return res.status(400).json({ message: 'Matière inconnue' });

    const isTronc = mat.rows[0].is_tronc_commun;

    // Si tronc commun et pas de cible fournie -> dupliquer selon matiere_filiere
    if (isTronc && (!filiereId || !niveauId)) {
      const targets = await db.query(
        'SELECT filiere_id, niveau_id FROM matiere_filiere WHERE matiere_id = $1',
        [matiereId]
      );
      if (targets.rows.length === 0) {
        return res.status(400).json({ message: 'Matière tronc commun sans filières/niveaux cibles' });
      }

      try {
        await db.query('BEGIN');
        const inserted = [];
        for (const t of targets.rows) {
          // Vérifier conflits pour chaque duplication (excl : pas d'exclude)
          const conflict = await checkConflicts({
            professeurId,
            salleId,
            date,
            heureDebut,
            heureFin
          });
          if (conflict.conflict) {
            await db.query('ROLLBACK');
            return res.status(409).json({ message: `Conflit détecté (${conflict.type}) lors de la duplication`, details: conflict.exams });
          }

          const ins = await db.query(
            `INSERT INTO examens (date, heureDebut, heureFin, professeurId, salleId, matiereId, filiereId, niveauId)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [date, heureDebut, heureFin, professeurId, salleId, matiereId, t.filiere_id, t.niveau_id]
          );
          inserted.push(ins.rows[0]);
        }
        await db.query('COMMIT');

        // Notification (unique ou multiple) - on envoie une notification simple au professeur
        const prof = await db.query('SELECT email FROM professeurs WHERE id=$1', [professeurId]);
        if (prof.rows[0]?.email) {
          notifyProfesseur(prof.rows[0].email, `Un examen (tronc commun) a été planifié le ${date} de ${heureDebut} à ${heureFin} (dupliqué sur ${inserted.length} filières).`);
        }

        return res.status(201).json({ insertedCount: inserted.length, exams: inserted });
      } catch (err) {
        await db.query('ROLLBACK');
        console.error('POST /examens (tronc) error:', err);
        return res.status(500).json({ message: 'Erreur serveur (transaction)' });
      }
    }

    // Cas normal : vérifier conflits puis insérer
    const conflict = await checkConflicts({ professeurId, salleId, date, heureDebut, heureFin });
    if (conflict.conflict) {
      return res.status(409).json({ message: `Conflit détecté (${conflict.type})`, details: conflict.exams });
    }

    const result = await db.query(
      `INSERT INTO examens (date, heureDebut, heureFin, professeurId, salleId, matiereId, filiereId, niveauId)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [date, heureDebut, heureFin, professeurId, salleId, matiereId, filiereId || null, niveauId || null]
    );

    // Notification prof
    const prof = await db.query('SELECT email FROM professeurs WHERE id=$1', [professeurId]);
    if (prof.rows[0]?.email) {
      notifyProfesseur(prof.rows[0].email, `Un examen vous a été assigné le ${date} de ${heureDebut} à ${heureFin}.`);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /examens error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * PATCH /api/examens/:id
 * Met à jour un examen (vérifie les conflits en excluant l'examen courant).
 */
router.patch('/:id', auth, async (req, res) => {
  const examId = req.params.id;
  const { date, heureDebut, heureFin, professeurId, salleId, matiereId, filiereId, niveauId } = req.body;

  try {
    // Récupérer l'examen courant
    const curRes = await db.query('SELECT * FROM examens WHERE id = $1', [examId]);
    if (curRes.rows.length === 0) return res.status(404).json({ message: 'Examen non trouvé' });
    const cur = curRes.rows[0];

    // Nouvelle values (garder valeur actuelle si non fournie)
    const newDate = date || cur.date;
    const newHeureDebut = heureDebut || cur.heureDebut;
    const newHeureFin = heureFin || cur.heureFin;
    const newProf = professeurId || cur.professeurId;
    const newSalle = salleId || cur.salleId;

    // Vérifier conflits en excluant l'examen courant
    const conflict = await checkConflicts({
      professeurId: newProf,
      salleId: newSalle,
      date: newDate,
      heureDebut: newHeureDebut,
      heureFin: newHeureFin,
      excludeId: examId
    });
    if (conflict.conflict) {
      return res.status(409).json({ message: `Conflit détecté (${conflict.type})`, details: conflict.exams });
    }

    const upd = await db.query(
      `UPDATE examens
       SET date=$1, heureDebut=$2, heureFin=$3, professeurId=$4, salleId=$5, matiereId=$6, filiereId=$7, niveauId=$8
       WHERE id=$9
       RETURNING *`,
      [newDate, newHeureDebut, newHeureFin, newProf, newSalle, matiereId || cur.matiereId, filiereId || cur.filiereId, niveauId || cur.niveauId, examId]
    );

    // Optionnel: notifier le prof si changement important
    const prof = await db.query('SELECT email FROM professeurs WHERE id=$1', [newProf]);
    if (prof.rows[0]?.email) {
      notifyProfesseur(prof.rows[0].email, `Un examen vous a été (mis à jour) le ${newDate} de ${newHeureDebut} à ${newHeureFin}.`);
    }

    res.json(upd.rows[0]);
  } catch (err) {
    console.error('PATCH /examens/:id error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * DELETE /api/examens/:id
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const del = await db.query('DELETE FROM examens WHERE id=$1 RETURNING *', [req.params.id]);
    if (del.rows.length === 0) return res.status(404).json({ message: 'Examen non trouvé' });
    res.json({ message: 'Examen supprimé', exam: del.rows[0] });
  } catch (err) {
    console.error('DELETE /examens/:id error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;