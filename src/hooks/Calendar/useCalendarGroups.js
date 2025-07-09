import { useState, useEffect, useCallback } from 'react';
import {
  fetchCalendarGroups,
  createCalendarGroup,
  updateCalendarGroup,
  deleteCalendarGroup
} from '@/services/calendar/calendarGroupService';

export default function useCalendarGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los grupos
  const getGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCalendarGroups();
      setGroups(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  // Crear grupo
  const handleCreate = async (group) => {
    setLoading(true);
    try {
      const newGroup = await createCalendarGroup(group);
      setGroups(prev => [...prev, newGroup]);
      return newGroup;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar grupo
  const handleUpdate = async (id, group) => {
    setLoading(true);
    try {
      const updated = await updateCalendarGroup(id, group);
      setGroups(prev => prev.map(g => g.id === id ? updated : g));
      return updated;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar grupo
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteCalendarGroup(id);
      setGroups(prev => prev.filter(g => g.id !== id));
    } finally {
      setLoading(false);
    }
  };

  return {
    groups,
    loading,
    error,
    getGroups,
    createGroup: handleCreate,
    updateGroup: handleUpdate,
    deleteGroup: handleDelete
  };
}
