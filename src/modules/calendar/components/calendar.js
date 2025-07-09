'use client';

import React, { useEffect, useState } from "react";
import { CalendarProvider } from "@/modules/calendar/contexts/calendar-context";
import { CalendarHeader } from "@/modules/calendar/components/header/calendar-header";
import { CalendarBody } from "@/modules/calendar/components/calendar-body";
import { EventUpdateHandler } from "@/modules/calendar/components/event-update-handler";
import { DragDropProvider } from "@/modules/calendar/contexts/drag-drop-context";

import { getCalendarOverviewEvents } from "@/services/calendar/calendarOverviewService";
// import { getUsers } from "@/services/user/userService"; // 🔒 Comentado porque no se usa por ahora

export function Calendar() {
  const [events, setEvents] = useState([]);
  // const [users, setUsers] = useState([]); // 🔒 Comentado porque no hay users
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCalendarData = async () => {
      try {
        const events = await getCalendarOverviewEvents();
        // const users = await getUsers(); // 🔒 Comentado temporalmente
        setEvents(events);
        // setUsers(users); // 🔒 Comentado temporalmente
      } catch (error) {
     
      } finally {
        setLoading(false);
      }
    };

    loadCalendarData();
  }, []);

  if (loading) return <div className="p-4">Cargando calendario...</div>;

  return (
    <DragDropProvider>
      <CalendarProvider
        events={events}
        users={[]} // 🔒 Se pasa array vacío por ahora
        view="month"
      >
        <div className="w-full border rounded-xl">
          <EventUpdateHandler />
          <CalendarHeader />
          <CalendarBody />
        </div>
      </CalendarProvider>
    </DragDropProvider>
  );
}
