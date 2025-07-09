'use client';

import { Button } from "@/components/calendarui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/calendarui/ui/dropdown-menu";
import {
  DotIcon,
  MoonIcon,
  PaletteIcon,
  SettingsIcon,
  SunMediumIcon,
} from "lucide-react";

import { Switch } from "@/components/calendarui/ui/switch";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { useTheme } from "next-themes";

export function Settings() {
  const {
    badgeVariant,
    setBadgeVariant,
    use24HourFormat,
    toggleTimeFormat,
    view,
    setView,
    agendaModeGroupBy,
    setAgendaModeGroupBy,
  } = useCalendar();

  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === "dark";
  const isDotVariant = badgeVariant === "dot";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Calendar settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Modo dark
            <DropdownMenuShortcut>
              <Switch
                icon={
                  isDarkMode ? (
                    <MoonIcon className="h-4 w-4" />
                  ) : (
                    <SunMediumIcon className="h-4 w-4" />
                  )
                }
                checked={isDarkMode}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            Utilizar puntos
            <DropdownMenuShortcut>
              <Switch
                icon={
                  isDotVariant ? (
                    <DotIcon className="w-4 h-4" />
                  ) : (
                    <PaletteIcon className="w-4 h-4" />
                  )
                }
                checked={isDotVariant}
                onCheckedChange={(checked) =>
                  setBadgeVariant(checked ? "dot" : "colored")
                }
              />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            Formato de 24 horas
            <DropdownMenuShortcut>
              <Switch
                icon={
                  use24HourFormat ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-clock-24"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 12a9 9 0 0 0 5.998 8.485m12.002 -8.485a9 9 0 1 0 -18 0" />
                      <path d="M12 7v5" />
                      <path d="M12 15h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" />
                      <path d="M18 15v2a1 1 0 0 0 1 1h1" />
                      <path d="M21 15v6" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-clock-12"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 12a9 9 0 0 0 9 9m9 -9a9 9 0 1 0 -18 0" />
                      <path d="M12 7v5l.5 .5" />
                      <path d="M18 15h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" />
                      <path d="M15 21v-6" />
                    </svg>
                  )
                }
                checked={use24HourFormat}
                onCheckedChange={toggleTimeFormat}
              />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup className="w-56">
          <DropdownMenuLabel>Default view</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={view} onValueChange={(value) => setView(value)}>
            <DropdownMenuRadioItem value="day">Dia</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="week">Semana</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="month">Mes</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="year">Año</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="agenda">Agenda</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Agenda view group by</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={agendaModeGroupBy}
            onValueChange={(value) => setAgendaModeGroupBy(value)}
          >
            <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="color">Color</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
