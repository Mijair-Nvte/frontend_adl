'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import MultiSelect from '@/components/ui/MultiSelect';
import StatusSelect from '@/components/ui/StatusSelect';
import useApiUsers from '@/hooks/users/useApiUsers';
import useApiTaskStatuses from '@/hooks/tasks/useApiTaskStatuses';
import useApiCases from '@/hooks/cases/useApiCases';
import submitTaskForm from '@/services/tasks/submitTaskForm';
import useCalendarGroups from '@/hooks/Calendar/useCalendarGroups';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import CustomSelect from '../ui/Select';


const initialForm = {
  title: '',
  description: '',
  case_id: '',
  assigned_users: [],
  task_status_id: '',
  due_date: '',
  start_datetime: '',
  end_datetime: '',
  sync_to_google: false,
  calendar_group_id: '',
};

export default function TaskForm({ task, setTasks, onSaved, onClose, fetchTasks }) {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { groups, loading: loadingGroups } = useCalendarGroups();

  const { users } = useApiUsers();
  const { statuses } = useApiTaskStatuses();
  const { cases } = useApiCases();

  const groupOptions = groups.map((group) => ({
    value: group.id,
    label: group.name,
    color: group.color || '#3b82f6',
  }));

  useEffect(() => {
    if (task) {

      setFormData({
        title: task.title || '',
        description: task.description || '',
        case_id: task.case_id || '',
        assigned_users: task.assigned_to?.map(user => user.id) || [],
        task_status_id: task.task_status_id || '',
        start_datetime: task.start_datetime || '',
        end_datetime: task.end_datetime || '',
        sync_to_google: task.sync_to_google || false,
        calendar_group_id: task.calendar_group_id || '',

      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitTaskForm({
      task,
      formData,
      setTasks,
      fetchTasks,
      onSaved,
      onClose,
      resetForm: () => setFormData(initialForm),
      setLoading,
      setSuccess,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <Input label="Título" name="title" value={formData.title} onChange={handleChange} placeholder="Titulo de la tarea" required />

      <div>
        <label className="text-sm font-medium text-gray-700" >Descripción</label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded w-full mt-1"
          rows={3}
          placeholder="Descripción opcional..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estatus */}
        <StatusSelect
          label="Estatus"
          value={formData.task_status_id} // SOLO el ID
          onChange={(e) =>
            handleChange({ target: { name: 'task_status_id', value: e.target.value } })
          }
          options={statuses.map((s) => ({
            value: s.id,
            label: s.label,
            color: s.color,
          }))}
          isLoading={!statuses.length}
        />


        {/* Asignado */}
        <MultiSelect
          label="Asignar a"
          name="assigned_users"
          value={users
            .filter((u) => formData.assigned_users?.includes(u.id))
            .map((u) => ({ value: u.id, label: u.name }))}
          options={users.map((u) => ({
            value: u.id,
            label: u.name,
          }))}
          onChange={(selected) =>
            setFormData((prev) => ({
              ...prev,
              assigned_users: selected.map((s) => s.value),
            }))
          }
        />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Caso */}
        <CustomSelect
        label="Asociar proyecto"
          name="case_id"
          value={formData.case_id}
          onChange={handleChange}
          options={cases.map((c) => ({
            value: c.id,
            label: `#${c.case_number} - ${c.title}`,
          }))}
          placeholder="Seleccionar proyecto..."
        />


        {/* Fecha y hora de inicio */}
        <Input
          label="Inicio"
          name="start_datetime"
          type="datetime-local"
          value={formData.start_datetime}
          onChange={handleChange}
          required
        />

        {/* Fecha y hora de fin */}
        <Input
          label="Fin"
          name="end_datetime"
          type="datetime-local"
          value={formData.end_datetime}
          onChange={handleChange}
        />
        <StatusSelect
          label="Grupo"
          value={formData.calendar_group_id}
          onChange={(e) =>
            handleChange({
              target: { name: 'calendar_group_id', value: e.target.value },
            })
          }
          options={groupOptions}
          isLoading={loadingGroups}
        />



      </div>
      <div className="flex items-center gap-2 mt-6">
        <input
          type="checkbox"
          name="sync_to_google"
          checked={formData.sync_to_google}
          onChange={handleChange}
        />
        <label className="text-sm text-gray-700">Sincronizar con Google Calendar</label>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4 pt-6 border-t mt-8">
        <Button
          onClick={onClose}
          size="md"

          type="button"
          variant="secondary"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          size="md"

          disabled={loading}
          variant="primary"
        >
          {loading ? 'Guardando...' : task ? 'Actualizar Tarea' : 'Crear Tarea'}
        </Button>
      </div>

    </form>
  );
}
