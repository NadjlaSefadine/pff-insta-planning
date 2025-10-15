const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcryptjs');


const { v4: uuidv4 } = require('uuid');
const transporter = require('../config/mailer');

router.post('/examen', (req, res) => {
  res.send('Examen OK');
});

// Fonction pour générer un OTP aléatoire à 6 chiffres
function genererNombreAleatoire() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/register", async (req, res) => {
  const { nom, email, password, role } = req.body;

  if (!['admin', 'prof'].includes(role)) {
    return res.status(400).json({ message: "Rôle invalide. Utilisez 'admin' ou 'prof'." });
  }
  router.post('/utilisateurs', async (req, res) => {
    // ta logique pour enregistrer un utilisateur (copier depuis /register)
  });
  

  try {
    // Vérifier si l'email existe déjà
    const userCheck = await db.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ message: "L'email existe déjà" });
    }
    
    

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le nouvel utilisateur
    const newUser = await db.query(
      `INSERT INTO utilisateurs (nom, email, password, role)
       VALUES ($1, $2, $3, $4) RETURNING id, nom, email, role`,
      [nom, email, hashedPassword, role]
    );

    const user = newUser.rows[0];

    // Générer OTP + token
    const otp = genererNombreAleatoire();
    const otpToken = uuidv4();

    // Sauvegarder OTP
    await db.query(
      'INSERT INTO otps (user_id, otp, otp_token, purpose) VALUES ($1, $2, $3, $4)',
      [user.id, otp, otpToken, 'verify-email']
    );

    // Envoyer l'e-mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Vérification de l'email",
      html: `
        <h1>Vérification de l'email</h1>
        <p>Voici votre code de vérification :</p>
        <strong>${otp}</strong>
      `
    });

    res.status(201).json({
      message: "Utilisateur enregistré avec succès. Vérifiez votre email.",
      otpToken,
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.patch("/verify", async (req, res) => {
  const { otp, otpToken, purpose } = req.body;

  try {
    if (purpose !== "verify-email") {
      return res.status(422).send({ message: "Objectif invalide" });
    }

    const otpResult = await db.query(
      'SELECT * FROM otps WHERE otp_token = $1 AND purpose = $2',
      [otpToken, purpose]
    );

    const otpDetails = otpResult.rows[0];
console.log(otpDetails);

    if (!otpDetails || otpDetails.otp !== otp) {
      return res.status(406).send({ message: "OTP invalide" });
    }

    // Vérifier l'utilisateur
    const verifiedUserResult = await db.query(
      'UPDATE utilisateurs SET is_verified = TRUE WHERE id = $1 RETURNING *',
      [otpDetails.user_id]
    );

    const verifiedUser = verifiedUserResult.rows[0];

    res.send({
      message: "Utilisateur vérifié avec succès",
      verifiedUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erreur serveur" });
  }
});

// LOGIN (déjà bon)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM utilisateurs WHERE email=$1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
