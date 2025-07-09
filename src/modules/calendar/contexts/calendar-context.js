"use client";

import React, { createContext, useContext, useState,useEffect } from "react";
import { EVENT_COLORS, CALENDAR_VIEWS } from "@/modules/calendar/types";
import { useLocalStorage } from "@/modules/calendar/hooks";
import { getCalendarOverviewEvents } from "@/services/calendar/calendarOverviewService";
import useApiUsers from "@/hooks/users/useApiUsers";
import useApiCases from "@/hooks/cases/useApiCases";
import useCalendarGroups from '@/hooks/Calendar/useCalendarGroups';

const DEFAULT_SETTINGS = {
  badgeVariant: "colored",
  view: CALENDAR_VIEWS.DAY,
  use24HourFormat: true,
  agendaModeGroupBy: "date",
};

const CalendarContext = createContext({});

export function CalendarProvider({
  children,
  events,
  badge = "colored",
  view = CALENDAR_VIEWS.DAY,
}) {
  const [settings, setSettings] = useLocalStorage("calendar-settings", {
    ...DEFAULT_SETTINGS,
    badgeVariant: badge,
    view,
  });

  const [badgeVariant, setBadgeVariantState] = useState(settings.badgeVariant);
  const [currentView, setCurrentViewState] = useState(settings.view);
  const [use24HourFormat, setUse24HourFormatState] = useState(settings.use24HourFormat);
  const [agendaModeGroupBy, setAgendaModeGroupByState] = useState(settings.agendaModeGroupBy);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUserId, setSelectedUserId] = useState("all");
  const [selectedColors, setSelectedColors] = useState([]);

  const [allEvents, setAllEvents] = useState(events || []);
  const [filteredEvents, setFilteredEvents] = useState(events || []);

  const { users: loadedUsers, loading: loadingUsers } = useApiUsers();
  const { cases: loadedCases, loading: loadingCases } = useApiCases();
  const { groups: loadedGroups, loading: loadingGroups } = useCalendarGroups();

  const [users, setUsers] = useState([]);
  const [cases, setCases] = useState([]);
  const [calendarGroups, setCalendarGroups] = useState([]);

  useEffect(() => {
    setUsers(loadedUsers);
  }, [loadedUsers]);

  useEffect(() => {
    setCases(loadedCases);
  }, [loadedCases]);

  useEffect(() => {
    setCalendarGroups(loadedGroups);
  }, [loadedGroups]);

  const fetchEvents = async () => {
    try {
      const events = await getCalendarOverviewEvents();
      setAllEvents(events);
      setFilteredEvents(events);
    } catch (error) {
      console.error("Error al recargar eventos:", error);
    }
  };


  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings });
  };

  const setBadgeVariant = (variant) => {
    setBadgeVariantState(variant);
    updateSettings({ badgeVariant: variant });
  };

  const setView = (newView) => {
    setCurrentViewState(newView);
    updateSettings({ view: newView });
  };

  const toggleTimeFormat = () => {
    const newValue = !use24HourFormat;
    setUse24HourFormatState(newValue);
    updateSettings({ use24HourFormat: newValue });
  };

  const setAgendaModeGroupBy = (groupBy) => {
    setAgendaModeGroupByState(groupBy);
    updateSettings({ agendaModeGroupBy: groupBy });
  };

  const filterEventsBySelectedColors = (color) => {
    const isColorSelected = selectedColors.includes(color);
    const newColors = isColorSelected
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];

    if (newColors.length > 0) {
      const filtered = allEvents.filter((event) => {
        const eventColor = event.color || "blue";
        return newColors.includes(eventColor);
      });
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(allEvents);
    }

    setSelectedColors(newColors);
  };

  const filterEventsBySelectedUser = (userId) => {
    setSelectedUserId(userId);
    if (userId === "all") {
      setFilteredEvents(allEvents);
    } else {
      const filtered = allEvents.filter((event) => event.user.id === userId);
      setFilteredEvents(filtered);
    }
  };

  const handleSelectDate = (date) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const addEvent = (event) => {
    setAllEvents((prev) => [...prev, event]);
    setFilteredEvents((prev) => [...prev, event]);
  };

  const updateEvent = (event) => {
    const updated = {
      ...event,
      startDate: new Date(event.startDate).toISOString(),
      endDate: new Date(event.endDate).toISOString(),
    };

    setAllEvents((prev) => prev.map((e) => (e.id === event.id ? updated : e)));
    setFilteredEvents((prev) => prev.map((e) => (e.id === event.id ? updated : e)));
  };

  const removeEvent = (eventId) => {
    setAllEvents((prev) => prev.filter((e) => e.id !== eventId));
    setFilteredEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const clearFilter = () => {
    setFilteredEvents(allEvents);
    setSelectedColors([]);
    setSelectedUserId("all");
  };

  const value = {
    selectedDate,
    setSelectedDate: handleSelectDate,
    selectedUserId,
    setSelectedUserId,
    badgeVariant,
    setBadgeVariant,
    selectedColors,
    filterEventsBySelectedColors,
    filterEventsBySelectedUser,
    events: filteredEvents,
    view: currentView,
    use24HourFormat,
    toggleTimeFormat,
    setView,
    agendaModeGroupBy,
    setAgendaModeGroupBy,
    addEvent,
    updateEvent,
    removeEvent,
    clearFilter,
    fetchEvents,
    users,
    cases,
    calendarGroups,
    loadingUsers,
    loadingCases,
    loadingGroups,
  };

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider.");
  }
  return context;
}
