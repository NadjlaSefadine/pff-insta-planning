import React, { useEffect, useState } from "react";
import HomeSection from "./dashboard/HomeSection";
import UserManagement from "./dashboard/UserManagement";
import AddUserForm from "./dashboard/AddUserForm";
import RoomManagement from "./dashboard/RoomManagement";
import ModuleManagement from "./dashboard/ModuleManagement";
import TeacherAvailability from "./dashboard/TeacherAvailability";
import ScheduleManager from "./dashboard/ScheduleManager";
import RoomSchedule from "./dashboard/RoomSchedule";
import CreateSchedule from "./dashboard/CreateSchedule";
import api from "../api";

export default function Dashboard() {
  const [counts, setCounts] = useState({ profs: 0, salles: 0, exams: 0 });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      console.log("Loading dashboard data...");

      await Promise.all([
        api.get("/professeurs"),
        api.get("/salles"),
        api.get("/examens?limit=10"),
      ])
        .then((responses) => {
          // console.log("API responses received:", responses);
          const [p, s, e] = responses;
          setCounts({
            profs: p.data.length,
            salles: s.data.length,
            exams: e.data.length,
          });
          // console.log("Counts set to:", {
          //   profs: p.data.length,
          //   salles: s.data.length,
          //   exams: e.data.length,
          // });
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div>
      <h2>Dashboard</h2>
      <div id="admin-dashboard" className="dashboard">
        <div className="welcome-message">
          <h2>Espace Administrateur</h2>
          <p>Bienvenue Admin</p>
        </div>
      </div>
      <div className="grid">
        <div className="card">
          Professeurs
          <br />
          <strong>{counts.profs}</strong>
        </div>
        <div className="card">
          Salles
          <br />
          <strong>{counts.salles}</strong>
        </div>
        <div className="card">
          Examens (affichés)
          <br />
          <strong>{counts.exams}</strong>
        </div>
      </div>

      <HomeSection />
      {/* <UserManagement />
      <AddUserForm />
      <RoomManagement />
      <ModuleManagement />
      <TeacherAvailability />
      <ScheduleManager />
      <RoomSchedule />
      <CreateSchedule /> */}
    </div>
  );
}
