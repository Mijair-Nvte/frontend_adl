'use client';

import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,

} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useState } from 'react';
import TaskKanbanColumn from './TaskKanbanColumn';
import TaskCard from './TaskCard';
import { updateTaskStatus, updateTaskOrder } from '@/services/tasks/taskService';
import TaskDrawer from './TaskDrawer';
import useApiTaskById from '@/hooks/tasks/useApiTaskById';
import useApiTaskStatuses from '@/hooks/tasks/useApiTaskStatuses';

export default function TaskKanban({ tasks, setTasks, fetchTasks, onViewDetails, onDeleteTask }) {
  const { statuses, loading: loadingStatuses } = useApiTaskStatuses();
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const { task: selectedTask } = useApiTaskById(selectedTaskId);

  const closeDrawer = () => setSelectedTaskId(null); //para cerrar el taskdrawer


  const handleViewTask = (id) => {
    if (onViewDetails) onViewDetails(id); // 🔄 se comunica con el padre
  };


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 👈 solo activará drag si se mueve 8px
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  if (loadingStatuses) return <p className="text-center mt-6">Cargando tareas...</p>;

  const groupedTasks = statuses.reduce((acc, status) => {
    acc[status.id] = tasks.filter(task => task.task_status_id === status.id);
    return acc;
  }, {});

  const handleDragStart = (event) => {
    const taskId = event.active.id;
    const task = tasks.find(t => t.id == taskId);
    setActiveTask(task);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    const taskId = active.id;
    const newStatusId = over.data?.current?.statusId;
    const oldStatusId = active.data?.current?.statusId;

    const movedTask = tasks.find(t => t.id == taskId);
    if (!movedTask) return;

    const reorderedTasks = { ...groupedTasks };

    if (oldStatusId !== newStatusId) {
      reorderedTasks[oldStatusId] = reorderedTasks[oldStatusId].filter(t => t.id !== taskId);
      movedTask.task_status_id = newStatusId;
      reorderedTasks[newStatusId] = [movedTask, ...(reorderedTasks[newStatusId] || [])];

      try {
        await updateTaskStatus(taskId, newStatusId);
      } catch (err) {
        console.error("❌ Error al actualizar status", err);
      }
    } else {
      const oldIndex = reorderedTasks[oldStatusId].findIndex(t => t.id === active.id);
      const newIndex = reorderedTasks[oldStatusId].findIndex(t => t.id === over.id);
      reorderedTasks[oldStatusId] = arrayMove(reorderedTasks[oldStatusId], oldIndex, newIndex);
    }

    const tasksToUpdate = Object.entries(reorderedTasks).flatMap(([statusId, taskList]) =>
      taskList.map((task, index) => ({
        id: task.id,
        task_status_id: parseInt(statusId),
        position: index,
      }))
    );

    try {
      await updateTaskOrder(tasksToUpdate);
    } catch (err) {
      console.error("❌ Error al actualizar orden", err);
    }

    // Refresca desde la base de datos
    await fetchTasks();
  };




  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full px-1 w-full overflow-x-auto">

        {statuses.map((status) => (
          <div
            key={status.id}
            className="flex flex-col flex-1 min-w-[220px]"          >
            <SortableContext
              id={`column-${status.id}`}
              items={groupedTasks[status.id]?.map(task => task.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <TaskKanbanColumn
                status={status}
                tasks={groupedTasks[status.id] || []}
                onView={handleViewTask}
                onDelete={onDeleteTask}
              />
            </SortableContext>
          </div>
        ))}


        <TaskDrawer
          isOpen={!!selectedTaskId}
          onClose={closeDrawer}
          task={selectedTask}
          setTasks={setTasks}
          fetchTasks={fetchTasks}
        />



      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
