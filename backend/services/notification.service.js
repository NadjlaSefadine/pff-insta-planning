// Ici, on peut envoyer un email ou créer une notification dans la base
const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Univ Planning" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });

  console.log('Email envoyé:', info.messageId);
}

async function notifyProfesseur(professeurEmail, message) {
  // Pour l’instant, notification simple par email
  try {
    await sendEmail(professeurEmail, 'Notification examen', message);
  } catch (err) {
    console.error('Erreur envoi email:', err.message);
  }
}

module.exports = { sendEmail, notifyProfesseur };