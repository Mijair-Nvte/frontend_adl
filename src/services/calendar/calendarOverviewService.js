import axios from 'axios';
import { createEvent, createUser } from "@/modules/calendar/interfaces";
import { EVENT_COLORS } from "@/modules/calendar/types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/calendar/overview`;

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    };
};

const validateColor = (color) => {
    return EVENT_COLORS.includes(color) ? color : getRandomColor();
};

const getRandomColor = () =>
    EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)];

export const getCalendarOverviewEvents = async () => {
    const res = await axios.get(API_URL, getHeaders());

    const data = res.data;

  

    return data.items.map((item, index) => ({
        id: item.id ?? index,
        title: item.title ?? "Sin título",
        startDate: new Date(item.startTime).toISOString(),
        endDate: new Date(item.endTime).toISOString(),
        description: item.description ?? "",
       color: item.calendarGroup?.color ?? "blue",
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
        users: item.users ?? [],
        case: item.case ?? null,
        calendar_group: { id: item.calendarGroupId }, 

    }));
};
