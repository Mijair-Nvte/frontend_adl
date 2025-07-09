'use client';

import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Trash2,
  Pencil,
  PlusCircle,
  Check,
  Send,
} from 'lucide-react';
import {
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from '@/services/tasks/taskChecklistService';
import Input from "@/components/ui/Input";

export default function TaskChecklist({ checklist = [], taskId }) {
  const [items, setItems] = useState(checklist);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');


  const completedCount = items.filter(item => item.is_completed).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;


  const toggleItem = async (id, isCompleted) => {
    try {
      const updated = await updateChecklistItem(id, { is_completed: !isCompleted });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_completed: updated.is_completed } : item
        )
      );
    } catch (err) {
      console.error('❌ Error al actualizar ítem:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este ítem?')) return;
    try {
      await deleteChecklistItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('❌ Error al eliminar ítem:', err);
    }
  };

  const handleAddItem = async () => {
    if (!newTitle.trim()) return;
    try {
      console.log('Nuevo item:', { task_id: taskId, title: newTitle })
      const newItem = await createChecklistItem({ task_id: taskId, title: newTitle });
      setItems((prev) => [...prev, newItem]);
      setNewTitle('');
    } catch (err) {
      console.error('❌ Error al agregar ítem:', err);
    }
  };

  const handleEditSubmit = async (id) => {
    if (!editingValue.trim()) return;
    try {
      const updated = await updateChecklistItem(id, { title: editingValue });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, title: updated.title } : item
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error('❌ Error al editar ítem:', err);
    }
  };

  return (
    <div className="border border-gray-100 rounded-lg bg-white mt-6">
      <div className="bg-indigo-500 p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Checklist</h2>
          <span className="text-indigo-100 text-sm">{progress}%</span>
        </div>
        <div className="mt-2 h-2 bg-white rounded">
          <div
            className="h-2 bg-green-500 rounded transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between px-4 py-3 group hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => toggleItem(item.id, item.is_completed)}
                className={`flex items-center justify-center w-5 h-5 rounded-full border ${item.is_completed ? "bg-indigo-600 border-indigo-600" : "border-gray-300"
                  }`}
              >
                <Check
                  className={`w-3 h-3 transition ${item.is_completed ? "text-white opacity-100" : "text-transparent opacity-0"
                    }`}
                />
              </button>


              {editingId === item.id ? (
                <Input
                  name={`edit-${item.id}`}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  placeholder="Editar ítem..."
                  autoComplete="off"
                  className="text-sm py-1"
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // 👈 Para que no haga submit de un form externo
                      await handleEditSubmit(item.id);
                    } else if (e.key === "Escape") {
                      setEditingId(null);
                    }
                  }}
                />
              ) : (
                <span
                  onDoubleClick={() => {
                    setEditingId(item.id);
                    setEditingValue(item.title);
                  }}
                  className={`flex-1 text-sm cursor-pointer ${item.is_completed ? "line-through text-gray-400" : "text-gray-800"
                    }`}
                >
                  {item.title}
                </span>
              )}

            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
              <Pencil
                onClick={() => {
                  setEditingId(item.id);
                  setEditingValue(item.title);
                }}
                className="w-4 h-4 text-gray-400 hover:text-indigo-600 cursor-pointer"
              />
              <Trash2
                onClick={() => handleDelete(item.id)}
                className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer"
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t p-4">
        <div className="relative">
          <Input
            name="new-checklist-item"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nuevo ítem..."
            autoComplete="off"
            className="text-sm py-2 pr-10" // espacio para el botón send
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddItem();
              }
            }}
          />
          <button
            onClick={handleAddItem}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800"
            title="Agregar"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
