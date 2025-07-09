'use client';

import Drawer from '@/components/ui/Drawer';
import TaskForm from './TaskForm';

export default function TaskDrawer({ isOpen, onClose, task, setTasks,fetchTasks, onSaved }) {
  const title = task ? 'Editar Tarea' : 'Nueva Tarea';

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <TaskForm
        task={task}
        onClose={onClose}
        setTasks={setTasks}
        onSaved={onSaved}
         fetchTasks={fetchTasks} 
      />
    </Drawer>
  );
}
