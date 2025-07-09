import { createEvent, updateEvent } from './eventService';

export default async function submitEventForm({
  event,
  formData,
  setEvents,
  fetchEvents,
  onSaved,
  onClose,
  resetForm,
  setLoading,
  setSuccess
}) {
  setLoading(true);
  try {
    const data = event
      ? await updateEvent(event.id, formData)
      : await createEvent(formData);

    if (fetchEvents) {
      await fetchEvents();
    } else if (setEvents) {
      setEvents(prev =>
        event
          ? prev.map((e) => (e.id === event.id ? data : e))
          : [data, ...prev]
      );
    }

    setSuccess(true);
    resetForm();
    onClose();
    if (onSaved) onSaved();
  } catch (err) {
    console.error("Error al guardar evento", err);
    alert("❌ " + (err.response?.data?.message || err.message));
  } finally {
    setLoading(false);
  }
}
