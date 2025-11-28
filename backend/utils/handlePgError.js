// utils/handlePgError.js

function handlePgError(err, res) {
  console.error("Erreur PostgreSQL :", err.detail || err.message);

  if (err.code === "23505") {
    // Violation de contrainte UNIQUE
    switch (err.constraint) {
      case "unique_prof_exam":
        return res.status(400).json({
          message:
            "⚠️ Conflit détecté : ce professeur a déjà un examen programmé à cette date et à ces horaires.",
        });

      case "unique_salle_exam":
        return res.status(400).json({
          message:
            "⚠️ Conflit détecté : cette salle est déjà réservée à cette date et à ces horaires.",
        });

      default:
        return res.status(400).json({
          message:
            "⚠️ Conflit détecté : un doublon existe dans la base de données.",
        });
    }
  }

  // Autres erreurs (non prévues)
  return res
    .status(500)
    .json({ message: "Erreur serveur interne. Veuillez réessayer." });
}

module.exports = handlePgError;
