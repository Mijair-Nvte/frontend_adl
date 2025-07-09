'use client';

import React, { useState } from 'react';
import Table from '@/components/ui/Table';
import TableActions from '@/components/ui/TableActions';
import TaskCardList from './mobile/TaskCardList';
import Image from 'next/image';

export default function TaskList({ tasks = [], onEditTask, onViewTask, setTasks, onDeleteTask }) {
  const [statusFilter, setStatusFilter] = useState('pending');

  const statuses = [
    { label: 'Pendientes', value: 'pending' },
    { label: 'En Progreso', value: 'in_progress' },
    { label: 'En Revision', value: 'in_review' },
    { label: 'Completadas', value: 'completed' },
  ];

  const filteredTasks = tasks.filter(task => task.status?.value === statusFilter);



  const columns = [
    {
      label: 'Título',
      key: 'title',
      render: (task) => (
        <div>
          <p className="font-semibold">{task.title}</p>
          <p className="text-xs text-gray-500">{task.description || 'Sin descripción'}</p>
        </div>
      ),
    },
    {
      label: 'Estado',
      key: 'status',
      render: (task) => (
        <span
          className="px-2 py-1 text-xs rounded-full"
          style={{
            backgroundColor: `${task.status?.color || '#ccc'}22`,
            color: task.status?.color || '#333',
          }}
        >
          {task.status?.label}
        </span>
      ),
    },
    {
      label: 'Etiquetas',
      key: 'tags',
      render: (task) =>
        task.tags?.length > 0 ? (
          <div className="flex gap-1 flex-wrap">
            {task.tags.map((tag) => (
              <span key={tag.id} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                {tag.label}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400">Sin etiquetas</span>
        ),
    },
    {
      label: 'Progreso',
      key: 'checklist_items',
      render: (task) => {
        const completed = task.checklist_items?.filter((i) => i.is_completed).length || 0;
        const total = task.checklist_items?.length || 0;
        const percentage = total > 0 ? (completed / total) * 100 : 0;

        return (
          <div className="w-full max-w-[100px]">
            <div className="h-1.5 bg-gray-200 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-[10px] text-center text-gray-500 mt-1">{completed}/{total}</div>
          </div>
        );
      },
    },
    {
      label: 'Asignado a',
      key: 'assigned_to',
      render: (task) => {
        const users = Array.isArray(task.assigned_to) ? task.assigned_to : [];

        return (
          <div className="flex items-center gap-2">
            <div>
              {users.length > 0 ? (
                <div className="flex -space-x-2">
                  {users.map((user) => {
                    const avatar = user.profile?.avatar || null;
                    const initials = user.name
                      ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
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
              ) : (
                <span className="text-xs text-gray-400">Sin asignar</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      label: 'Acciones',
      key: 'actions',
      render: (task) => (
        <TableActions
          onView={() => onViewTask(task.id)}
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task.id)}

        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap justify-center md:justify-start">
        {statuses.map((s) => {
          const isActive = statusFilter === s.value;
          return (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border shadow-sm
          ${isActive
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-blue-600'}`}
            >
              {/* Icono opcional por estado (puedes poner un pequeño circulito o similar) */}
              <span
                className={`inline-block w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-400'
                  }`}
              ></span>
              {s.label}
            </button>
          );
        })}
      </div>


      <div className="hidden md:block">
        <Table columns={columns} data={filteredTasks} isLoading={false} />
      </div>

      <div className="block md:hidden">
        <TaskCardList
          tasks={filteredTasks}
          onEditTask={onEditTask}
          onViewTask={onViewTask}
          onDeleteTask={onDeleteTask}
        />
      </div>
    </div>

  );
}
