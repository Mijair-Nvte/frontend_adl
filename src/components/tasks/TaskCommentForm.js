'use client';

import { useState, useEffect, useRef } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Smile } from 'lucide-react';

import { createTaskComment, updateTaskComment } from '@/services/tasks/taskCommentService';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';

export default function TaskCommentForm({
  taskId,
  parentId = null,
  commentId = null,
  initialValue = '',
  onCommentPosted,
  onCancelEdit, // ⚡ Nuevo prop opcional para notificar al padre que se cancele
}) {
  const [comment, setComment] = useState(initialValue);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const formRef = useRef(null);

  const handleEmojiSelect = (emoji) => {
    setComment((prev) => prev + emoji.native);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);
      let response;

      if (commentId) {
        response = await updateTaskComment(commentId, { comment });
      } else {
        response = await createTaskComment({
          task_id: taskId,
          comment,
          parent_id: parentId,
        });
      }

      setComment('');
      setShowEmojiPicker(false);
      if (onCommentPosted) onCommentPosted(response);
    } catch (err) {
      console.error('❌ Error al enviar comentario:', err);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Detectar clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        if (commentId && onCancelEdit) {
          onCancelEdit(); // Avisamos al padre que se cierre la edición
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [commentId, onCancelEdit]);

   return (
    <div className="space-y-2 mt-4 relative" ref={formRef}>
      <Textarea
        name="task-comment"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Escribe un comentario..."
      />

      <div className="flex items-center justify-between relative">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-indigo-600 hover:text-indigo-800 transition"
            title="Insertar emoji"
          >
            <Smile className="w-5 h-5" />
          </button>

          {showEmojiPicker && (
            <div className="absolute z-50 mt-2">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          loading={loading}
          variant="primary"
          size="sm"
        >
          {commentId ? 'Actualizar' : 'Comentar'}
        </Button>
      </div>
    </div>
  );
}
