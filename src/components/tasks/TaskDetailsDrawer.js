'use client';

import Drawer from '@/components/ui/Drawer';
import TaskDetails from './TaskDetails'; // componente que mostrará toda la info

export default function TaskDetailsDrawer({ isOpen, onClose, taskId, onEdit,onDelete }) {



  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Tarea"
      size="lg"
    >
      <TaskDetails taskId={taskId} onEdit={(taskData) => onEdit(taskData)} onDelete={(id) => {
        onDelete(id);
        onClose();
      }} />
    </Drawer>


  );
}
