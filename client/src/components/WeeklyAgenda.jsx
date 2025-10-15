import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../api';

export default function WeeklyAgenda() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadWeek();
  }, []);

  async function loadWeek() {
    try {
      // 
      //
      const from = new Date();
      const to = new Date();
      to.setDate(to.getDate() + 7);
      const res = await api.get(`/examens?from=${from.toISOString()}&to=${to.toISOString()}`);
      // transformer en format FullCalendar
      const ev = res.data.map(e => ({
        id: e.id,
        title: `${e.matiere_nom || ''} — ${e.prof_nom || ''}`,
        start: `${e.date}T${e.heuredebut || e.heureDebut}`,
        end: `${e.date}T${e.heurefin || e.heureFin}`,
        extendedProps: e
      }));
      setEvents(ev);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2>Agenda Hebdomadaire</h2>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        allDaySlot={false}
        slotMinTime="07:30:00"
        slotMaxTime="17:30:00"
        events={events}
        height="auto"
        eventClick={(info) => { alert(info.event.title); }}
      />
    </div>
  );
}
