import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  subDays,
  subMonths,
  subWeeks,
  subYears,
  isSameWeek,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  parseISO,
  differenceInMinutes,
  eachDayOfInterval,
  startOfDay,
  differenceInDays,
  isValid,
} from "date-fns";

import { EVENT_COLORS, CALENDAR_VIEWS } from "@/modules/calendar/types";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";

const FORMAT_STRING = "MMM d, yyyy";

export function rangeText(view, date) {
  let start, end;

  switch (view) {
    case CALENDAR_VIEWS.MONTH:
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    case CALENDAR_VIEWS.WEEK:
      start = startOfWeek(date);
      end = endOfWeek(date);
      break;
    case CALENDAR_VIEWS.DAY:
      return format(date, FORMAT_STRING);
    case CALENDAR_VIEWS.YEAR:
      start = startOfYear(date);
      end = endOfYear(date);
      break;
    case CALENDAR_VIEWS.AGENDA:
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    default:
      return "Error while formatting";
  }

  return `${format(start, FORMAT_STRING)} - ${format(end, FORMAT_STRING)}`;
}

export function navigateDate(date, view, direction) {
  const operations = {
    [CALENDAR_VIEWS.MONTH]: direction === "next" ? addMonths : subMonths,
    [CALENDAR_VIEWS.WEEK]: direction === "next" ? addWeeks : subWeeks,
    [CALENDAR_VIEWS.DAY]: direction === "next" ? addDays : subDays,
    [CALENDAR_VIEWS.YEAR]: direction === "next" ? addYears : subYears,
    [CALENDAR_VIEWS.AGENDA]: direction === "next" ? addMonths : subMonths,
  };

  return operations[view](date, 1);
}

export function getEventsCount(events, date, view) {
  const compareFns = {
    [CALENDAR_VIEWS.DAY]: isSameDay,
    [CALENDAR_VIEWS.WEEK]: isSameWeek,
    [CALENDAR_VIEWS.MONTH]: isSameMonth,
    [CALENDAR_VIEWS.YEAR]: isSameYear,
    [CALENDAR_VIEWS.AGENDA]: isSameMonth,
  };

  const compareFn = compareFns[view];
  return events.filter((event) => compareFn(parseISO(event.startDate), date)).length;
}

export function groupEvents(dayEvents) {
  const sortedEvents = dayEvents.sort(
    (a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
  );
  const groups = [];

  for (const event of sortedEvents) {
    const eventStart = parseISO(event.startDate);
    let placed = false;

    for (const group of groups) {
      const lastEventInGroup = group[group.length - 1];
      const lastEventEnd = parseISO(lastEventInGroup.endDate);

      if (eventStart >= lastEventEnd) {
        group.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) groups.push([event]);
  }

  return groups;
}

export function getEventBlockStyle(event, day, groupIndex, groupSize) {
  const startDate = parseISO(event.startDate);
  const dayStart = startOfDay(day);
  const eventStart = startDate < dayStart ? dayStart : startDate;
  const startMinutes = differenceInMinutes(eventStart, dayStart);

  const top = (startMinutes / 1440) * 100;
  const width = 100 / groupSize;
  const left = groupIndex * width;

  return { top: `${top}%`, width: `${width}%`, left: `${left}%` };
}

export function getCalendarCells(selectedDate) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = endOfMonth(selectedDate).getDate();
  const firstDayOfMonth = startOfMonth(selectedDate).getDay();
  const daysInPrevMonth = endOfMonth(new Date(year, month - 1)).getDate();
  const totalDays = firstDayOfMonth + daysInMonth;

  const prevMonthCells = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: daysInPrevMonth - firstDayOfMonth + i + 1,
    currentMonth: false,
    date: new Date(year, month - 1, daysInPrevMonth - firstDayOfMonth + i + 1),
  }));

  const currentMonthCells = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    currentMonth: true,
    date: new Date(year, month, i + 1),
  }));

  const nextMonthCells = Array.from({ length: (7 - (totalDays % 7)) % 7 }, (_, i) => ({
    day: i + 1,
    currentMonth: false,
    date: new Date(year, month + 1, i + 1),
  }));

  return [...prevMonthCells, ...currentMonthCells, ...nextMonthCells];
}

export function calculateMonthEventPositions(multiDayEvents, singleDayEvents, selectedDate) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const eventPositions = {};
  const occupiedPositions = {};

  eachDayOfInterval({ start: monthStart, end: monthEnd }).forEach((day) => {
    occupiedPositions[day.toISOString()] = [false, false, false];
  });

  const sortedEvents = [
    ...multiDayEvents.sort((a, b) => {
      const aDuration = differenceInDays(parseISO(a.endDate), parseISO(a.startDate));
      const bDuration = differenceInDays(parseISO(b.endDate), parseISO(b.startDate));
      return bDuration - aDuration || parseISO(a.startDate) - parseISO(b.startDate);
    }),
    ...singleDayEvents.sort((a, b) => parseISO(a.startDate) - parseISO(b.startDate)),
  ];

  sortedEvents.forEach((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    const eventDays = eachDayOfInterval({
      start: eventStart < monthStart ? monthStart : eventStart,
      end: eventEnd > monthEnd ? monthEnd : eventEnd,
    });

    let position = -1;

    for (let i = 0; i < 3; i++) {
      if (
        eventDays.every((day) => {
          const dayPositions = occupiedPositions[startOfDay(day).toISOString()];
          return dayPositions && !dayPositions[i];
        })
      ) {
        position = i;
        break;
      }
    }

    if (position !== -1) {
      eventDays.forEach((day) => {
        const dayKey = startOfDay(day).toISOString();
        occupiedPositions[dayKey][position] = true;
      });
      eventPositions[event.id] = position;
    }
  });

  return eventPositions;
}

export function getMonthCellEvents(date, events, eventPositions) {
  const dayStart = startOfDay(date);
  return events
    .filter((event) => {
      const eventStart = parseISO(event.startDate);
      const eventEnd = parseISO(event.endDate);
      return (
        (dayStart >= eventStart && dayStart <= eventEnd) ||
        isSameDay(dayStart, eventStart) ||
        isSameDay(dayStart, eventEnd)
      );
    })
    .map((event) => ({
      ...event,
      position: eventPositions[event.id] ?? -1,
      isMultiDay: event.startDate !== event.endDate,
    }))
    .sort((a, b) => {
      if (a.isMultiDay && !b.isMultiDay) return -1;
      if (!a.isMultiDay && b.isMultiDay) return 1;
      return a.position - b.position;
    });
}

export function formatTime(date, use24HourFormat) {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsedDate)) return "";
  return format(parsedDate, use24HourFormat ? "HH:mm" : "h:mm a");
}

export const getFirstLetters = (str) => {
  if (!str) return "";
  const words = str.split(" ");
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return `${words[0][0].toUpperCase()}${words[1]?.[0]?.toUpperCase() ?? ""}`;
};

export const getEventsForDay = (events, date, isWeek = false) => {
  const targetDate = startOfDay(date);
  return events
    .filter((event) => {
      const start = startOfDay(parseISO(event.startDate));
      const end = startOfDay(parseISO(event.endDate));
      if (isWeek) return start <= targetDate && end >= targetDate && start !== end;
      return start <= targetDate && end >= targetDate;
    })
    .map((event) => {
      const start = startOfDay(parseISO(event.startDate));
      const end = startOfDay(parseISO(event.endDate));
      let point;
      if (isSameDay(start, end)) point = "none";
      else if (isSameDay(start, targetDate)) point = "start";
      else if (isSameDay(end, targetDate)) point = "end";
      return { ...event, point };
    });
};

export const getWeekDates = (date) => {
  const startDate = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
};

export const getEventsForWeek = (events, date) => {
  const [startOfWeekDate, , , , , , endOfWeekDate] = getWeekDates(date);
  return events.filter((event) => {
    const start = parseISO(event.startDate);
    const end = parseISO(event.endDate);
    return isValid(start) && isValid(end) && start <= endOfWeekDate && end >= startOfWeekDate;
  });
};

export const getEventsForMonth = (events, date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return events.filter((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    return isValid(eventStart) && isValid(eventEnd) && eventStart <= end && eventEnd >= start;
  });
};

export const getEventsForYear = (events, date) => {
  if (!events || !Array.isArray(events) || !isValid(date)) return [];
  const start = startOfYear(date);
  const end = endOfYear(date);
  return events.filter((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    return isValid(eventStart) && isValid(eventEnd) && eventStart <= end && eventEnd >= start;
  });
};

export const getColorClass = (color) => {
  const colorClasses = {
    red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
    green: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
    blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
    orange: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300",
    purple: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",
  };
  return colorClasses[color] || "";
};

export const getBgColor = (color) => {
  const colorClasses = {
    red: "bg-red-400 dark:bg-red-600",
    yellow: "bg-yellow-400 dark:bg-yellow-600",
    green: "bg-green-400 dark:bg-green-600",
    blue: "bg-blue-400 dark:bg-blue-600",
    orange: "bg-orange-400 dark:bg-orange-600",
    purple: "bg-purple-400 dark:bg-purple-600",
  };
  return colorClasses[color] || "";
};

export const useGetEventsByMode = (events) => {
  const { view, selectedDate } = useCalendar();

  switch (view) {
    case CALENDAR_VIEWS.DAY:
      return getEventsForDay(events, selectedDate);
    case CALENDAR_VIEWS.WEEK:
      return getEventsForWeek(events, selectedDate);
    case CALENDAR_VIEWS.MONTH:
    case CALENDAR_VIEWS.AGENDA:
      return getEventsForMonth(events, selectedDate);
    case CALENDAR_VIEWS.YEAR:
      return getEventsForYear(events, selectedDate);
    default:
      return [];
  }
};

export const toCapitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
