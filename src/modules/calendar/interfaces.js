import { EVENT_COLORS } from "@/modules/calendar/types";

// Función para validar si un color es permitido
export function isValidEventColor(color) {
  return EVENT_COLORS.includes(color);
}

// Estructura esperada de un evento (referencial, no enforceable en JS)
export const createEvent = ({
  id,
  startDate,
  endDate,
  title,
  color,
  description,
  user,
}) => ({
  id,
  startDate,
  endDate,
  title,
  color,
  description,
  user,
});

// Estructura de un usuario (referencial)
export const createUser = ({ id, name, picturePath }) => ({
  id,
  name,
  picturePath,
});

// Estructura de celda del calendario
export const createCalendarCell = ({ day, currentMonth, date }) => ({
  day,
  currentMonth,
  date,
});
