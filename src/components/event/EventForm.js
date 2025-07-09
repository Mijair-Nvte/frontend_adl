'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import useApiCases from '@/hooks/cases/useApiCases';
import submitEventForm from '@/services/event/submitEventForm';
import useApiUsers from '@/hooks/users/useApiUsers';
import MultiSelect from '@/components/ui/MultiSelect';
import useCalendarGroups from '@/hooks/Calendar/useCalendarGroups';
import StatusSelect from '../ui/StatusSelect';
import Button from '../ui/Button';

const initialForm = {
  title: '',
  description: '',
  start_datetime: '',
  end_datetime: '',
  all_day: false,
  case_id: '',
  sync_to_google: false,
  user_ids: [],
  calendar_group_id: '',
};

export default function EventForm({ event, setEvents, fetchEvents, onSaved, onClose }) {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { groups, loading: loadingGroups } = useCalendarGroups();

  const { cases } = useApiCases();

  const { users } = useApiUsers();

  const userOptions = users.map(user => ({
    label: user.name,
    value: user.id,
  }));

  const groupOptions = groups.map((group) => ({
    value: group.id,
    label: group.name,
    color: group.color || '#3b82f6', // asegúrate que tengan color
  }));
  useEffect(() => {
    if (event) {
      console.log('🧩 Evento recibido:', event);

      setFormData({
        title: event.title || '',
        description: event.description || '',
        start_datetime: event.start_datetime || '',
        end_datetime: event.end_datetime || '',
        all_day: event.all_day || false,
        case_id: event.case_id || '',
        sync_to_google: event.sync_to_google || false,
        user_ids: event.user_ids || [],
       calendar_group_id: event.calendar_group_id || '',



      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitEventForm({
      event,
      formData,
      setEvents,
      fetchEvents,
      onSaved,
      onClose,
      resetForm: () => setFormData(initialForm),
      setLoading,
      setSuccess,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <Input label="Título" name="title" value={formData.title} onChange={handleChange} required />

      <div>
        <label className="text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded w-full mt-1"
          rows={3}
          placeholder="Descripción opcional..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Fecha y hora de inicio"
          name="start_datetime"
          type="datetime-local"
          value={formData.start_datetime}
          onChange={handleChange}
          required
        />
        <Input
          label="Fecha y hora de fin"
          name="end_datetime"
          type="datetime-local"
          value={formData.end_datetime}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Proyecto asociado</label>
          <select
            name="case_id"
            value={formData.case_id}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-1"
          >
            <option value="">Seleccionar proyecto...</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                #{c.case_number} - {c.title}
              </option>
            ))}
          </select>
        </div>

        <MultiSelect
          label="Participantes"
          name="user_ids"
          value={userOptions.filter(option => formData.user_ids.includes(option.value))}
          options={userOptions}
          onChange={(selected) =>
            setFormData(prev => ({
              ...prev,
              user_ids: selected.map(opt => opt.value),
            }))
          }
        />

        <StatusSelect
          label="Grupo calendario"
          value={formData.calendar_group_id}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              calendar_group_id: e.target.value,
            }))
          }
          options={groupOptions}
          isLoading={loadingGroups}
        />


        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="sync_to_google"
            checked={formData.sync_to_google}
            onChange={handleChange}
          />
          <label className="text-sm text-gray-700">Sincronizar con Google Calendar</label>
        </div>
      </div>



      <div className="flex justify-end gap-4 pt-6 border-t mt-8">
        <Button
          onClick={onClose}
          type="button"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Guardando...' : event ? 'Actualizar Evento' : 'Crear Evento'}
        </Button>
      </div>


    </form>
  );
}
