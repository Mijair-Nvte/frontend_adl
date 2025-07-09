"use client";

import { useDragDrop } from "@/modules/calendar/contexts/drag-drop-context";
import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import axios from "axios";

export function EventUpdateHandler() {
  const { setOnEventDropped } = useDragDrop();
  const { updateEvent } = useCalendar();

  const handleEventUpdate = useCallback(
    async (event, newStartDate, newEndDate) => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Usar el prefijo que viene en el ID: task-211 o event-47
        const isTask = event.id.startsWith("task-");
        const isEvent = event.id.startsWith("event-");

        const endpoint = isTask
          ? "tasks"
          : isEvent
            ? "events"
            : null;

        if (!endpoint) {
          console.warn("Tipo de evento desconocido:", event);
          return;
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}/${event.id}/time`;

        

        await axios.patch(
          url,
          {
            start_datetime: newStartDate.toISOString(),
            end_datetime: newEndDate.toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const updatedItem = {
          ...event,
          startDate: newStartDate.toISOString(),
          endDate: newEndDate.toISOString(),
        };

        updateEvent(updatedItem);
        toast.success(`${isTask ? "Tarea" : "Evento"} actualizado correctamente`);
      } catch (error) {
        console.error("❌ Error al actualizar:", error);
        toast.error("Error al guardar el cambio");
      }
    },
    [updateEvent]
  );

  useEffect(() => {
    setOnEventDropped(handleEventUpdate);
  }, [setOnEventDropped, handleEventUpdate]);

  return null;
}
