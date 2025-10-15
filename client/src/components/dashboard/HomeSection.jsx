import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faDoorOpen,
  faBook,
  faChalkboardTeacher,
  faGraduationCap,
  faCalendar,
  faUsers,
  faUserFriends,
  faUserCog,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const menuItems = [
  { id: "emploi-du-temps", icon: faCalendarAlt, label: "EMPLOI DU TEMPS" },
  { id: "salle", icon: faDoorOpen, label: "SALLE" },
  { id: "module", icon: faBook, label: "MODULE" },
  { id: "enseignant", icon: faChalkboardTeacher, label: "ENSEIGNANT" },
  { id: "formation", icon: faGraduationCap, label: "FORMATION" },
  { id: "semestre", icon: faCalendar, label: "SEMESTRE" },
  { id: "section", icon: faUsers, label: "SECTION" },
  { id: "groupe", icon: faUserFriends, label: "GROUPE" },
  { id: "utilisateur", icon: faUserCog, label: "UTILISATEUR" },
  { id: "creer-edt", icon: faPlusCircle, label: "CRÉER EMPLOI DU TEMPS" },
];

const HomeSection = () => {
  const [hovered, setHovered] = useState(null);

  const styles = {
    menu: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // fixed typo
      gap: "24px",
      padding: "10px",
      justifyItems: "center",
      alignItems: "stretch",
    },
    menuItem: {
      backgroundColor: "#fff",
      border: "1px solid #dee2e6",
      borderRadius: "12px",
      padding: "15px 10px",
      textAlign: "center",
      width: "100%",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
    },
    menuItemHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    },
    icon: {
      fontSize: "2.5rem",
      color: "#3949ab",
      marginBottom: "10px",
    },
    label: {
      fontSize: "1rem",
      fontWeight: "600",
      // color: "#333",
      marginTop: "8px",
    },
    link: {
      textDecoration: "none",
      color: "inherit",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };

  return (
    <div id="accueil" className="section">
      <div style={styles.menu}>
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              ...styles.menuItem,
              ...(hovered === index ? styles.menuItemHover : {}),
            }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            <Link to={item.id} style={styles.link}>
              <FontAwesomeIcon icon={item.icon} style={styles.icon} />
              <h3 style={styles.label}>{item.label}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeSection;
