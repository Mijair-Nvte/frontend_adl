import { createTask, updateTask } from './taskService';

export default async function submitTaskForm({
  task,
  formData,
  setTasks,
  fetchTasks,
  onSaved,
  onClose,
  resetForm,
  setLoading,
  setSuccess
}) {
  setLoading(true);
  try {
  const data = task
  ? await updateTask(task.id, formData)
  : await createTask({ ...formData, position: 0 });


    // 🔁 Reemplaza setTasks directo con fetchTasks
    if (fetchTasks) {
      await fetchTasks(); // recarga ordenada y actualizada
    } else if (setTasks) {
      // fallback solo por si acaso
      setTasks(prev =>
        task
          ? prev.map((t) => (t.id === task.id ? data.task : t))
          : [data.task, ...prev]
      );
    }

    setSuccess(true);
    resetForm();
    onClose();
  } catch (err) {
    console.error("Error al guardar tarea", err);
    alert("❌ " + (err.response?.data?.message || err.message));
  } finally {
    setLoading(false);
  }
}
