import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

export default function TaskKanbanColumn({ status, tasks, onView, onDelete }) {
  const { setNodeRef } = useDroppable({
    id: `column-${status.id}`,
    data: {
      statusId: status.id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-50 rounded-lg h-full flex flex-col overflow-y-auto border border-gray-200 shadow-sm"
    >
      {/* Header redondeado */}
      <div
        className="flex items-center justify-between rounded-full px-3 py-1.5 m-3 text-white text-sm font-semibold"
        style={{ background: status.color || '#ccc' }}
      >
        <div className="flex items-center gap-2">
          <span className="bg-white text-black text-[10px] text-shadow-sm rounded-full px-2 py-0.5 font-bold">
            {tasks.length}
          </span>
          {status.label}
        </div>

      </div>

      {/* Lista de tareas */}
      <div className="flex flex-col gap-3 p-3 flex-grow">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onView={onView}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>


  );
}
