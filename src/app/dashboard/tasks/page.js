'use client';

import React, { useState } from 'react';
import TaskKanban from '@/components/tasks/TaskKanban';
import TaskList from '@/components/tasks/TaskList';
import TasksHeader from '@/components/tasks/TasksHeader';
import useApiTasks from '@/hooks/tasks/useApiTasks';
import TaskDrawer from '@/components/tasks/TaskDrawer';
import TaskDetailsDrawer from '@/components/tasks/TaskDetailsDrawer';
import { deleteTask } from '@/services/tasks/taskService';

export default function TaskPage() {
  const { tasks, loading, error, setTasks, fetchTasks } = useApiTasks(); // ✅ AHORA SÍ
  const [viewMode, setViewMode] = useState('kanban');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [detailsTaskId, setDetailsTaskId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleCreate = () => {
    setSelectedTask(null);
    setIsOpen(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsOpen(true);
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error('❌ Error al eliminar la tarea:', err);
      alert('Error al eliminar la tarea');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <TasksHeader
        onCreate={handleCreate}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="p-4">
        {/* Desktop: mostrar Kanban o List */}
        <div className="hidden md:block">
          {viewMode === 'kanban' ? (
            <TaskKanban
              tasks={tasks}
              setTasks={setTasks}
              fetchTasks={fetchTasks}
              onDeleteTask={handleDeleteTask}
              onViewDetails={(id) => {
                setDetailsTaskId(id);
                setIsDetailsOpen(true);
              }}
            />
          ) : (
            <TaskList
              tasks={tasks}
              setTasks={setTasks}
              onEditTask={handleEdit}
              onDeleteTask={handleDeleteTask}
              onViewTask={(id) => {
                setDetailsTaskId(id);
                setIsDetailsOpen(true);
              }}
            />
          )}
        </div>

        {/* Móvil: siempre TaskList */}
        <div className="block md:hidden">
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            onEditTask={handleEdit}
            onDeleteTask={handleDeleteTask}
            onViewTask={(id) => {
              setDetailsTaskId(id);
              setIsDetailsOpen(true);
            }}
          />
        </div>
      </div>
      <TaskDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        task={selectedTask}
        setTasks={setTasks}
        fetchTasks={fetchTasks}
      />

      <TaskDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setDetailsTaskId(null);
        }}
        taskId={detailsTaskId}
        onEdit={(task) => {
          setIsDetailsOpen(false);
          setSelectedTask(task);
          setIsOpen(true);
        }}
        onDelete={handleDeleteTask}
      />


    </div>
  );
}
