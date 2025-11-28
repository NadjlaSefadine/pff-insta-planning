import React from 'react';
import { Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ProfessorsList from './components/ProfessorsList';
import RoomsList from './components/RoomsList';
import ExamForm, { ExamenForm } from './components/ExamForm';
import WeeklyAgenda from './components/WeeklyAgenda';
import { logout, getUser } from './auth';
import Timetable from "./components/Timetable";
import ScheduleManager from './components/dashboard/ScheduleManager';
import ModuleManagement from './components/dashboard/ModuleManagement';
import TeacherAvailability from './components/dashboard/TeacherAvailability';
import RoomManagement from './components/dashboard/RoomManagement';
import UserManagement from './components/dashboard/UserManagement';
import CreateSchedule from './components/dashboard/CreateSchedule';
import AddUserForm from './components/dashboard/AddUserForm';
import StudentDashboard from './components/dashboard/StudentDashboard';
import RoomSchedule from './components/dashboard/RoomSchedule';
import TimetableCreator from './components/dashboard/TimetableCreator';
// import Modules from "./components/Modules";
// import Semestre from './components/Semestre';

// const App = () => {
//   return (
//     <div>
//       <StudentDashboard />
//     </div>
//   );
// };

import { useParams } from 'react-router-dom';
import Layout from './components/partials/Layout';
import Footer from './components/partials/Footer';
import Header from './components/partials/Header';
import Disponibilite from './components/Disponiblite';


function RoomScheduleWrapper() {
  const { roomName } = useParams();
  return <RoomSchedule roomName={decodeURIComponent(roomName)} onBack={() => window.history.back()} />;
}

export default function App() {
  const user = getUser();
  return (
    <div className="app">
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
                  {/* <li><Link to="semestre">Semestre</Link></li> */}
                  <li><Link to="section">Section</Link></li>
                  <li><Link to="utilisateur">Utilisateur</Link></li>
                  <li><Link to="examens/new">Ajouter un examen</Link></li>
                </ul>
                <button className="logout-btn" onClick={() => { logout(); window.location.href = '/login'; }}>Déconnexion</button>
              </div>
            </>
          ) : (
            // <button className="login-btn">
            <ul className="nav-menu" >
              <li className=''>
                <Link to="/login"></Link>
              </li>
            </ul>
            // </button>
          )}
        </nav>
          {/* Dashboard routes */}
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="agenda" element={<PrivateRoute><WeeklyAgenda /></PrivateRoute>} />
          <Route path="profs" element={<PrivateRoute><ProfessorsList /></PrivateRoute>} />
          <Route path="salles" element={<PrivateRoute><RoomsList /></PrivateRoute>} />
          <Route path="emploi-du-temps" element={<PrivateRoute><ScheduleManager /></PrivateRoute>} />
          <Route path="salle" element={<PrivateRoute><RoomManagement /></PrivateRoute>} />
          <Route path="salle/:roomName" element={<PrivateRoute><RoomScheduleWrapper /></PrivateRoute>} />
          {/* <Route path="module" element={<PrivateRoute><Modules /></PrivateRoute>} /> */}
          <Route path="enseignant" element={<PrivateRoute><TeacherAvailability/></PrivateRoute>} />
          {/* <Route path="formation" element={<PrivateRoute>< RoomsList/></PrivateRoute>} /> */}
          {/* <Route path="semestre" element={<PrivateRoute><Semestre /></PrivateRoute>} /> */}
          {/* <Route path="section" element={<PrivateRoute>< /></PrivateRoute>} /> */}
          <Route path="groupe" element={<PrivateRoute><RoomsList /></PrivateRoute>} />
          <Route path="utilisateur" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
          <Route path="add-user" element={<PrivateRoute><AddUserForm /></PrivateRoute>} />
          <Route path="creer-edt" element={<PrivateRoute><Timetable /></PrivateRoute>} />
          <Route path="student-dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
          <Route path="examens/new" element={<PrivateRoute><ExamForm /></PrivateRoute>} />
          <Route path="enseignant" element={<PrivateRoute><Disponibilite /></PrivateRoute>} />
          <Route path="timetable-creator" element={<PrivateRoute><TimetableCreator /></PrivateRoute>} />
          {/* <Route path="section" element={<PrivateRoute><ModuleManagement /></PrivateRoute>} />
          <Route path="semestre" element={<PrivateRoute><Semestre /></PrivateRoute>} />
          <Route path="module" element={<PrivateRoute><Modules /></PrivateRoute>} />
          <Route path="formation" element={<PrivateRoute><RoomsList /></PrivateRoute>} /> */}

          <Route path="examenRoutes" element={<PrivateRoute><ExamenForm /></PrivateRoute>} />
          </Routes>
        <Footer />
      </div>
    </div>
  );
}