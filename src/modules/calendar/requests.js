import { createEvent, createUser } from "@/modules/calendar/interfaces";
import { EVENT_COLORS } from "@/modules/calendar/types";

// 👉 Compatible con CALENDAR_ITEMS_MOCK
export const getEvents = async () => {
  const res = await fetch("http://127.0.0.1:8000/api/v1/calendar/overview");
  const data = await res.json();

  return data.items.map((item, index) =>
    createEvent({
      id: item.id ?? index,
      title: item.title ?? "Sin título",
      startDate: new Date(item.startTime).toISOString(),
      endDate: new Date(item.endTime).toISOString(),
      description: item.description ?? "",
      color: validateColor(item.color), // SOLO nombre de color
      user: item.user
        ? createUser({
            id: item.user.id,
            name: item.user.name,
            picturePath: item.user.picturePath ?? null,
          })
        : createUser({
            id: "unknown",
            name: "Sin usuario",
            picturePath: null,
          }),
    })
  );
};

// 🔍 Solo permite colores válidos
const validateColor = (color) => {
  return EVENT_COLORS.includes(color) ? color : getRandomColor();
};

const getRandomColor = () =>
  EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)];

export const getUsers = async () => {
  return []; // o haz fetch a una API si lo necesitas
};
