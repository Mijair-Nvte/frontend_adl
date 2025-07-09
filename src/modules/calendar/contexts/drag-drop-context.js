"use client";

import React, { createContext, useContext, useState } from "react";

// Opcional: puedes importar createEvent desde interfaces.js si lo usas
// import { createEvent } from "@/modules/calendar/interfaces";

const DragDropContext = createContext(undefined);

export function DragDropProvider({ children }) {
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [onEventDropped, setOnEventDroppedCallback] = useState(undefined);

  const startDrag = (event) => {
    setDraggedEvent(event);
    setIsDragging(true);
  };

  const endDrag = () => {
    setDraggedEvent(null);
    setIsDragging(false);
  };

  const handleEventDrop = (targetDate, hour, minute) => {
    if (!draggedEvent || !onEventDropped) return;

    const originalStart = new Date(draggedEvent.startDate);
    const originalEnd = new Date(draggedEvent.endDate);
    const duration = originalEnd.getTime() - originalStart.getTime();

    const newStart = new Date(targetDate);
    if (hour !== undefined) {
      newStart.setHours(hour);
      newStart.setMinutes(minute || 0);
    } else {
      newStart.setHours(originalStart.getHours());
      newStart.setMinutes(originalStart.getMinutes());
    }

    const newEnd = new Date(newStart.getTime() + duration);

    const isSamePosition =
      originalStart.getFullYear() === newStart.getFullYear() &&
      originalStart.getMonth() === newStart.getMonth() &&
      originalStart.getDate() === newStart.getDate() &&
      originalStart.getHours() === newStart.getHours() &&
      originalStart.getMinutes() === newStart.getMinutes();

    if (!isSamePosition) {
      onEventDropped(draggedEvent, newStart, newEnd);
    }

    endDrag();
  };

  const setOnEventDropped = (callback) => {
    setOnEventDroppedCallback(() => callback);
  };

  return (
    <DragDropContext.Provider
      value={{
        draggedEvent,
        isDragging,
        startDrag,
        endDrag,
        handleEventDrop,
        onEventDropped,
        setOnEventDropped,
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error("useDragDrop must be used within a DragDropProvider");
  }
  return context;
}
