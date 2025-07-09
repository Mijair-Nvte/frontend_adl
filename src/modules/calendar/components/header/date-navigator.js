'use client';

import { useMemo } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { es } from "date-fns/locale";

import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import {
  buttonHover,
  transition,
} from "@/modules/calendar/animations";

import { Badge } from "@/components/calendarui/ui/badge";
import { Button } from "@/components/calendarui/ui/button";

import {
  getEventsCount,
  navigateDate,
  rangeText,
} from "@/modules/calendar/helpers";

const MotionButton = motion(Button);
const MotionBadge = motion(Badge);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function DateNavigator({ view, events }) {
  const { selectedDate, setSelectedDate } = useCalendar();


const rawMonth = format(selectedDate, "MMMM", { locale: es });
const month = capitalize(rawMonth);

  const year = selectedDate.getFullYear();

  const eventCount = useMemo(
    () => getEventsCount(events, selectedDate, view),
    [events, selectedDate, view]
  );

  const handlePrevious = () =>
    setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () =>
    setSelectedDate(navigateDate(selectedDate, view, "next"));

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <motion.span
          className="text-lg font-semibold"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={transition}
        >
          {month} {year}
        </motion.span>
        <AnimatePresence mode="wait">
          <MotionBadge
            key={eventCount}
            variant="secondary"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={transition}
          >
            {eventCount} events
          </MotionBadge>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        <MotionButton
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={handlePrevious}
          variants={buttonHover}
          whileHover="hover"
          whileTap="tap"
        >
          <ChevronLeft className="h-4 w-4" />
        </MotionButton>

        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition}
        >
          {rangeText(view, selectedDate)}
        </motion.p>

        <MotionButton
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={handleNext}
          variants={buttonHover}
          whileHover="hover"
          whileTap="tap"
        >
          <ChevronRight className="h-4 w-4" />
        </MotionButton>
      </div>
    </div>
  );
}
