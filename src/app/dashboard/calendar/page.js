import React, { Suspense } from "react";
import { Calendar } from "@/modules/calendar/components/calendar";
import { CalendarSkeleton } from "@/modules/calendar/components/skeletons/calendar-skeleton";

export default function CalendarPage() {
  return (
    <main className="flex h-screen bg-white flex-col z-30 rounded-2xl">
      <div className="container p-2 md:mx-auto">
        <Suspense fallback={<CalendarSkeleton />}>
          <Calendar />
        </Suspense>
      </div>
    </main>
  );
}
