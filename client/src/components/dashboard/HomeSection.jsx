import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const menuItems = [
  { id: 'emploi-du-temps', icon: faCalendarAlt, label: 'EMPLOI DU TEMPS' },
  { id: 'salle', icon: faDoorOpen, label: 'SALLE' },
  { id: 'module', icon: faBook, label: 'MODULE' },
  { id: 'enseignant', icon: faChalkboardTeacher, label: 'ENSEIGNANT' },
  { id: 'formation', icon: faGraduationCap, label: 'FORMATION' },
  { id: 'semestre', icon: faCalendar, label: 'SEMESTRE' },
  { id: 'section', icon: faUsers, label: 'SECTION' },
  { id: 'groupe', icon: faUserFriends, label: 'GROUPE' },
  { id: 'utilisateur', icon: faUserCog, label: 'UTILISATEUR' },
  { id: 'creer-edt', icon: faPlusCircle, label: 'CRÉER EMPLOI DU TEMPS' }
];

const HomeSection = () => {
  return (
    <div id="accueil" className="section">
      <div className="menu">
        {menuItems.map(item => (
          <div
            key={item.id}
            className="menu-item"
            // onClick={() => onSelectSection(item.id)}
          >
            <Link to={item.id} smooth="true" duration={500}>
            <FontAwesomeIcon icon={item.icon} />
            <h3>{item.label}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeSection;
