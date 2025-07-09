"use client";

import { format, parseISO } from "date-fns";
import { Calendar, Clock, Text, User } from "lucide-react";
import { ReactNode } from "react";
import { toast } from "sonner";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/calendarui/ui/dialog";
import { ScrollArea } from "@/components/calendarui/ui/scroll-area";
import { AddEditEventDialog } from "@/modules/calendar/components/dialogs/add-edit-event-dialog";
import { Button } from "@/components/calendarui/ui/button";
import Image from 'next/image';

import { useCalendar } from "../../contexts/calendar-context";
import { formatTime } from "../../helpers";
import { deleteEvent as apiDeleteEvent, deleteTask as apiDeleteTask } from "@/services/event/eventService"; // si `deleteTask` está ahí, si no, cámbialo al de tasks


export function EventDetailsDialog({ event, children }) {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const { use24HourFormat, removeEvent } = useCalendar();

  const deleteEvent = async (eventId) => {
    try {
      const [type, realId] = (eventId || "").includes("-")
        ? eventId.split("-")
        : ["event", eventId];

      if (type === "task") {
        await apiDeleteTask(realId);
      } else {
        await apiDeleteEvent(realId);
      }

      removeEvent(eventId);

      toast.success(`${type === "task" ? "Tarea" : "Evento"} eliminado correctamente.`);
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Ocurrió un error al eliminar.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-4 p-4">
            <div className="text-sm text-muted-foreground space-y-2">
              {event.users && event.users.length > 0 ? (
                event.users.map((user) => (
                  <div key={user.id} className="flex items-center gap-2">
                    {user.picturePath ? (
                      <Image
                        src={user.picturePath}
                        alt={user.name}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-cover"
                      />

                    ) : (
                      <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span>{user.name}</span>
                  </div>
                ))
              ) : (
                <p className="italic text-muted-foreground">Sin participantes</p>
              )}

              {event.case && (
                <div className="flex items-start gap-2">
                  <User className="mt-1 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Caso asociado</p>
                    <p className="text-sm text-muted-foreground">
                      <a
                        href={`/dashboard/cases/${event.case.id}`}
                        target="_blank"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {event.case.title}
                      </a>
                    </p>
                  </div>
                </div>
              )}


            </div>


            <div className="flex items-start gap-2">
              <Calendar className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Fecha de inicio</p>
                <p className="text-sm text-muted-foreground">
                  {format(startDate, "EEEE dd MMMM", { locale: es })}
                  <span className="mx-1">at</span>
                  {formatTime(parseISO(event.startDate), use24HourFormat)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Fecha de finalizacion</p>
                <p className="text-sm text-muted-foreground">
                  {format(endDate, "EEEE dd MMMM", { locale: es })}
                  <span className="mx-1">at</span>
                  {formatTime(parseISO(event.endDate), use24HourFormat)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Text className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Descripcion</p>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2">
          <AddEditEventDialog event={event}>
            <Button variant="outline">Editar</Button>
          </AddEditEventDialog>
          <Button variant="destructive" onClick={() => deleteEvent(event.id)}>
            Eliminar
          </Button>
        </div>

        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
