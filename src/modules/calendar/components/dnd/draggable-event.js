"use client";

import { motion } from 'framer-motion';
import { useDragDrop } from '@/modules/calendar/contexts/drag-drop-context';
import { EventDetailsDialog } from '@/modules/calendar/components/dialogs/event-details-dialog';

export function DraggableEvent({ event, children, className }) {
  const { startDrag, endDrag, isDragging, draggedEvent } = useDragDrop();

  const isCurrentlyDragged = isDragging && draggedEvent?.id === event.id;

  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <EventDetailsDialog event={event}>
      <motion.div
        className={`${className || ''} ${isCurrentlyDragged ? 'opacity-50 cursor-grabbing' : 'cursor-grab'}`}
        draggable
        onClick={handleClick}
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', event.id.toString());
          startDrag(event);
        }}
        onDragEnd={() => {
          endDrag();
        }}
      >
        {children}
      </motion.div>
    </EventDetailsDialog>
  );
}
