import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import {
  FaPaperclip,
  FaRegCommentDots,
  FaCheckCircle,
  FaCalendarAlt,
  FaTag,
  FaEye,
} from 'react-icons/fa';
import { Trash2 } from 'lucide-react';

export default function TaskCard({ task, isOverlay = false, onView, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    data: {
      statusId: task.task_status_id,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isOverlay ? 0.85 : 1,
    scale: isOverlay ? 1.03 : 1,
  };

  const completed = task.checklist_items?.filter(i => i.is_completed).length || 0;
  const total = task.checklist_items?.length || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white border border-gray-200 rounded shadow-xs hover:shadow-md transition-all duration-200 ${isOverlay ? 'border-blue-400' : ''}`}
      onClick={() => {
        if (!isOverlay && onView) {
          onView(task.id);
        }
      }}
    >
      {/* 🔲 CABECERA DRAGGABLE */}
      <div
        className="p-4 space-y-2 cursor-move"
        {...(!isOverlay && listeners)}
        {...(!isOverlay && attributes)}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm text-gray-800 leading-snug line-clamp-1">
            {task.title}
          </h3>
          {task.case?.case_number && (
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
              #{task.case.case_number}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 line-clamp-2">
          {task.description || 'Sin descripción'}
        </p>

        {task.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <span key={tag.id} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                <FaTag className="text-gray-400" />
                {tag.label}
              </span>
            ))}
          </div>
        )}

        {task.due_date && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FaCalendarAlt />
            {new Date(task.due_date).toLocaleDateString()}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex gap-3">
            <span className="flex items-center gap-1">
              <FaPaperclip /> {task.files?.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <FaCheckCircle className="text-green-500" />
              {completed}/{total}
            </span>
            <span className="flex items-center gap-1">
              <FaRegCommentDots /> {task.comments?.length || 0}
            </span>
          </div>

          {Array.isArray(task.assigned_to) && task.assigned_to.length > 0 ? (
            <div className="flex -space-x-2">
              {task.assigned_to.map(user => {
                const avatar = user.profile?.avatar || null;
                const initials = user.name
                  ? user.name
                    .split(' ')
                    .map(word => word[0])
                    .join('')
                    .toUpperCase()
                  : 'U';

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
            <span className="text-xs text-gray-400">Sin asignar</span>
          )}

        </div>
      </div>

  

    </div>
  );
}
