"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TableActions from "@/components/ui/TableActions";
import Image from "next/image";

export default function TaskCardList({
  tasks = [],
  onEditTask,
  onViewTask,
  onDeleteTask
}) {
  const router = useRouter();

  if (!tasks.length) {
    return <div className="p-4">No hay tareas</div>;
  }

  return (
    <div className="space-y-4 p-2">
      {tasks.map((task) => {
        const completed = task.checklist_items?.filter(i => i.is_completed).length || 0;
        const total = task.checklist_items?.length || 0;
        const percentage = total > 0 ? (completed / total) * 100 : 0;

        return (
          <div key={task.id} className="bg-white  border rounded-lg p-4">
            <div className="font-semibold text-gray-900">{task.title}</div>
            <div className="text-sm text-gray-600">{task.description || "Sin descripción"}</div>

            <div className="mt-2">
              <span
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${task.status?.color || "#ccc"}22`,
                  color: task.status?.color || "#333",
                }}
              >
                {task.status?.label}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {task.tags?.map(tag => (
                <span key={tag.id} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {tag.label}
                </span>
              ))}
            </div>

            <div className="mt-2">
              <div className="w-full max-w-[100px]">
                <div className="h-1.5 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-center text-gray-500 mt-1">{completed}/{total}</div>
              </div>
            </div>

            <div className="mt-2 flex -space-x-2">
              {task.assigned_to?.map(user => {
                const avatar = user.profile?.avatar || null;
                const initials = user.name
                  ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                  : 'U';

                return (
                  <div key={user.id} className="relative group">
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt={user.name}
                        fill
                        sizes="28px"
                        className="rounded-full border-2 border-white shadow object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-full border-2 border-white shadow text-xs">
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

            <div className="mt-2">
              <TableActions
                onView={() => onViewTask(task.id)}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
