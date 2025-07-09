'use client';
import Image from 'next/image';
import useApiTaskById from '@/hooks/tasks/useApiTaskById';
import TaskChecklist from './TaskChecklist';
import StatusBadge from '@/components/ui/StatusBadge';
import { FileText, AlignLeft, BadgeCheck, UserRoundCheck } from 'lucide-react';
import TaskComments from './TaskComments';
import { FaEdit } from 'react-icons/fa';
import EditButton from '@/components/ui/EditButton';
import DeleteButton from '@/components/ui/DeleteButton';

export default function TaskDetails({ taskId, onEdit, onDelete }) {
  const { task, loading, error } = useApiTaskById(taskId);

  if (loading || !task) return <p className="p-4 text-sm">Cargando tarea...</p>;
  if (error) return <p className="p-4 text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-6 p-4 text-gray-800">
      <div className="flex items-center justify-between">
        <div className="text-xs text-blue-600 font-medium uppercase tracking-wide">
          Dashboard / Tareas / #{task.id}
        </div>

        <div className="flex items-center gap-2">
          <EditButton onClick={() => onEdit(task)} title="Editar tarea" />
          <DeleteButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id); 
            }}
            title="Eliminar tarea"
          />
        </div>
      </div>


      <section className="space-y-2">
        <h2 className="text-base font-bold text-black-700 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-700" />
          Información General
        </h2>

        <p className="flex items-center gap-2">
          <AlignLeft className="w-4 h-4 text-gray-500" />
          <span>
            <strong className="text-black-700">Título:</strong> {task.title}
          </span>
        </p>


        <div className="flex items-center gap-2">
          <BadgeCheck className="w-4 h-4 text-gray-500" />
          <span>
            <strong className="text-black-700">Estado:</strong>
          </span>
          {task.status && (
            <StatusBadge label={task.status.label} color={task.status.color} />
          )}
        </div>

        <div className="flex items-center gap-2">
          <UserRoundCheck className="w-4 h-4 text-black-700" />
          <div>
            <strong className="text-black-700 block mb-1">Asignado a:</strong>
            {task.assigned_to && task.assigned_to.length > 0 ? (
              <div className="flex -space-x-2">
                {task.assigned_to.map((user) => {
                  const initials = user.name
                    ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                    : 'U';

                  const avatar = user.profile?.avatar || null;

                  return (
                    <div key={user.id} className="relative group">
                      {avatar ? (
                         <Image
                          src={avatar}
                          alt={user.name}
                          fill
                          sizes="32px"
                          className="rounded-full border-2 border-white shadow object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-full border-2 border-white shadow text-xs">
                          {initials}
                        </div>
                      )}
                      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition transform bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        {user.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <span className="text-gray-600 text-sm">Sin asignar</span>
            )}
          </div>
        </div>



        <p className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-black-700" />
          <span>
            <strong className="text-black-700">Descripción:</strong> {task.description}
          </span>
        </p>
      </section>

      <TaskChecklist checklist={task.checklist_items} taskId={task.id} />

      <TaskComments comments={task.comments} taskId={task.id} />
    </div>
  );
}
