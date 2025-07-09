"use client";

import {
  CalendarRange,
  Columns,
  Grid2X2,
  Grid3X3,
  LayoutList,
  List,
  Plus,
} from "lucide-react";

import { Button } from "@/components/calendarui/ui/button";
import { ButtonGroup } from "@/components/calendarui/ui/button-group";
import { Toggle } from "@/components/calendarui/ui/toggle";

import { UserSelect } from "@/modules/calendar/components/header/user-select";
import { TodayButton } from "@/modules/calendar/components/header/today-button";
import { DateNavigator } from "@/modules/calendar/components/header/date-navigator";
import { AddEditEventDialog } from "@/modules/calendar/components/dialogs/add-edit-event-dialog";
import FilterEvents from "@/modules/calendar/components/header/filter";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { useFilteredEvents } from "@/modules/calendar/hooks";
import { Settings } from "@/modules/calendar/components/settings/settings";

import { redirectToGoogleOAuth, verifyGoogleCalendarLinked, disconnectGoogleCalendar } from "@/services/calendar/calendarService";
import { useState } from "react";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useEffect } from "react";
export function CalendarHeader() {
  const { view, setView } = useCalendar();
  const events = useFilteredEvents();

  const [loading, setLoading] = useState(false);
  const [calendarLinked, setCalendarLinked] = useState(false);

  useEffect(() => {
    const checkCalendarStatus = async () => {
      const linked = await verifyGoogleCalendarLinked(false); // sin toast aquí
      setCalendarLinked(linked);
    };

    checkCalendarStatus();
  }, []);




    // Vincular calendario (flujo con popup)
    const handleConnectGoogle = async () => {
      try {
        setLoading(true);
        const authUrl = await redirectToGoogleOAuth();

        const popup = window.open(authUrl, "googleAuthPopup", "width=500,height=600");

        if (!popup) {
          showToast({
            type: "error",
            message: "No se pudo abrir la ventana emergente",
            description: "Verifica que el bloqueador de ventanas emergentes esté desactivado",
          });
          return;
        }

        const popupCheckInterval = setInterval(async () => {
          if (popup.closed) {
            clearInterval(popupCheckInterval);
            const linked = await verifyGoogleCalendarLinked(); // muestra toast
            setCalendarLinked(linked);
          }
        }, 500);
      } catch (err) {
        console.error("Error al conectar con Google:", err);
        showToast({
          type: "error",
          message: "Error al conectar con Google",
          description: "Intenta de nuevo más tarde",
        });
      } finally {
        setLoading(false);
      }
    };

    // ✅ Nueva función: decidir si vincular o desvincular
    const handleGoogleCalendarClick = async () => {
      if (calendarLinked) {
        const confirm = window.confirm("¿Estás seguro que deseas desvincular tu calendario?");
        if (!confirm) return;

        const success = await disconnectGoogleCalendar();
        if (success) setCalendarLinked(false);
      } else {
        await handleConnectGoogle();
      }
    };


    return (
      <div className=" flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <TodayButton />
          <DateNavigator view={view} events={events} />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5">
          <div className="options flex-wrap flex items-center gap-4 md:gap-2">
            <FilterEvents />
            <Button
              variant="outline"
              onClick={() => setView("agenda")}
              asChild
            >
              <Toggle className="relative">
                {view === "agenda" ? (
                  <>
                    <CalendarRange />
                    <span className="absolute -top-1 -right-1 size-3 rounded-full bg-green-400" />
                  </>
                ) : (
                  <LayoutList />
                )}
              </Toggle>
            </Button>
            <ButtonGroup className="flex">
              <Button
                variant={view === "day" ? "default" : "outline"}
                aria-label="View by day"
                onClick={() => setView("day")}
              >
                <List className="h-4 w-4" />
              </Button>

              <Button
                variant={view === "week" ? "default" : "outline"}
                aria-label="View by week"
                onClick={() => setView("week")}
              >
                <Columns className="h-4 w-4" />
              </Button>

              <Button
                variant={view === "month" ? "default" : "outline"}
                aria-label="View by month"
                onClick={() => setView("month")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>

              <Button
                variant={view === "year" ? "default" : "outline"}
                aria-label="View by year"
                onClick={() => setView("year")}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
            </ButtonGroup>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5">
            <div className="hidden">
              <UserSelect />
            </div>

            <AddEditEventDialog>
              <Button>
                <Plus className="h-4 w-4" />
                Evento
              </Button>
            </AddEditEventDialog>

            <Button
              onClick={handleGoogleCalendarClick}
              variant={calendarLinked ? "destructive" : "outline"}
              className={calendarLinked ? "bg-red-500 text-white hover:bg-red-600" : ""}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Conectando...
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  {calendarLinked ? "Desvincular Google Calendar" : "Vincular Google Calendar"}
                </>
              )}
            </Button>


          </div>

          <Settings />
        </div>
      </div>
    );
  }
