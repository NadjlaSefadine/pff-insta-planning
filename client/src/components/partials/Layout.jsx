import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link, Outlet } from 'react-router-dom';
import { getUser, logout } from '../../auth';

const Layout = () => {
  const user = getUser();

  return (
    <div>
      <Header />

      <div className="container">
        <nav id="main-nav">
          {user ? (
            <>
              <div className="container nav-container">
                <ul className="nav-menu">
                  <li><Link to="">Accueil</Link></li>
                  <li><Link to="emploi-du-temps">Emploi du temps</Link></li>
                  <li><Link to="salle">Salle</Link></li>
                  <li><Link to="module">Module</Link></li>
                  <li><Link to="enseignant">Enseignant</Link></li>
                  <li><Link to="formation">Formation</Link></li>
                  <li><Link to="semestre">Semestre</Link></li>
                  <li><Link to="section">Section</Link></li>
                  <li><Link to="groupe">Groupe</Link></li>
                  <li><Link to="utilisateur">Utilisateur</Link></li>
                </ul>
                <button className="logout-btn" onClick={() => { logout(); window.location.href = '/login'; }}>Déconnexion</button>
              </div>
              )
            </>
            ) : (
            <Link to="/login">Se connecter</Link>
          )}
        </nav>

        {/* <nav style={navStyle}>
        {user ? (
          <>
            <Link to="/" style={linkStyle}>Dashboard</Link>
            <Link to="/agenda" style={linkStyle}>Agenda Hebdo</Link>
            <Link to="/examens/new" style={linkStyle}>Créer examen</Link>
            <Link to="/profs" style={linkStyle}>Profs</Link>
            <Link to="/salles" style={linkStyle}>Salles</Link>
            <button onClick={() => { logout(); window.location.href = '/login'; }}>Déconnexion</button>
          </>
        ) : (
          <Link to="/login" style={linkStyle}>Se connecter</Link>
        )}
      </nav> */}

        <main><Outlet /></main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;