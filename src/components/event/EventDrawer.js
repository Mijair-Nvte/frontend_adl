'use client';

import Drawer from '@/components/ui/Drawer';
import EventForm from './EventForm';

export default function EventDrawer({ isOpen, onClose, event, loading, fetchEvents, onSaved, isCreating }) {
  const title = isCreating ? 'Nuevo Evento' : 'Editar Evento';

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title} size="lg">
      {isCreating || !loading ? (
        <EventForm
          event={isCreating ? null : event}
          onClose={onClose}
          fetchEvents={fetchEvents}
          onSaved={onSaved}
        />
      ) : (
        <div className="p-6 text-center text-gray-500">Cargando evento...</div>
      )}
    </Drawer>
  );
}
