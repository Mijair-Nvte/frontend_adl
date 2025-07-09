"use client";

import { useState } from 'react';
import { MessageCircle, Pencil, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import TaskCommentForm from './TaskCommentForm';
import { deleteTaskComment } from '@/services/tasks/taskCommentService';
import { useAuth } from '@/contexts/AuthContext';

export default function TaskComments({ comments = [], taskId }) {
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [localComments, setLocalComments] = useState(comments);

  const handleNewComment = (newComment) => {
    if (newComment.parent_id) {
      setLocalComments((prev) =>
        prev.map((c) =>
          c.id === newComment.parent_id
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : c
        )
      );
    } else {
      setLocalComments((prev) => [...prev, { ...newComment, replies: [] }]);
    }
    setReplyingTo(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este comentario?')) return;
    try {
      await deleteTaskComment(id);
      setLocalComments((prev) =>
        prev
          .filter((c) => c.id !== id)
          .map((c) => ({
            ...c,
            replies: c.replies?.filter((r) => r.id !== id) || [],
          }))
      );
    } catch (err) {
      console.error('❌ Error al eliminar comentario:', err);
    }
  };

  const renderComment = (comment, depth = 0) => {
    const isOwner = user?.id === comment.user?.id;

    return (
      <li
        key={comment.id}
        className={`border border-gray-200 bg-white rounded-md p-4 mb-3 ${
          depth > 0 ? 'ml-6 border-l-4 border-indigo-200' : ''
        }`}
      >
        <div className="flex justify-between items-start mb-1">
          <div>
            <span className="text-sm font-semibold text-gray-700">
              {comment.user?.name || 'Anónimo'}
            </span>
            <div className="text-xs text-gray-400">
              {dayjs(comment.created_at).format('DD MMM YYYY HH:mm')}
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-2 text-gray-500">
              <Pencil
                className="w-4 h-4 cursor-pointer hover:text-indigo-600"
                onClick={() => setEditingCommentId(comment.id)}
              />
              <Trash2
                className="w-4 h-4 cursor-pointer hover:text-red-500"
                onClick={() => handleDelete(comment.id)}
              />
            </div>
          )}
        </div>

        {editingCommentId === comment.id ? (
          <TaskCommentForm
            taskId={taskId}
            parentId={comment.parent_id}
            commentId={comment.id}
            initialValue={comment.comment}
            onCommentPosted={(updated) => {
              setLocalComments((prev) =>
                prev.map((c) =>
                  c.id === updated.id
                    ? { ...c, comment: updated.comment }
                    : {
                        ...c,
                        replies:
                          c.replies?.map((r) =>
                            r.id === updated.id ? { ...r, comment: updated.comment } : r
                          ) || [],
                      }
                )
              );
              setEditingCommentId(null);
            }}
             onCancelEdit={() => setEditingCommentId(null)}
          />
        ) : (
          <p className="text-sm text-gray-800">{comment.comment}</p>
        )}

        {depth < 1 && (
          <div className="text-xs text-indigo-600 mt-2 flex gap-4 cursor-pointer">
            <span onClick={() => setReplyingTo(comment.id)}>Responder</span>
          </div>
        )}

        {replyingTo === comment.id && (
          <TaskCommentForm
            taskId={taskId}
            parentId={comment.id}
            onCommentPosted={handleNewComment}
          />
        )}

        {comment.replies?.length > 0 && (
          <ul className="mt-4 space-y-3">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  const commentList = localComments.filter((c) => c.parent_id === null);
  const shouldScroll = commentList.length >= 10;

  return (
    <div className="border border-gray-100 rounded-lg bg-white mt-6">
      <div className="bg-indigo-500 p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Comentarios</h2>
          <span className="text-indigo-100 text-sm">{localComments.length} comentarios</span>
        </div>
      </div>

      {commentList.length === 0 ? (
        <p className="text-sm text-gray-500 p-4">No hay comentarios aún.</p>
      ) : (
        <div
          className={`space-y-2 p-4 ${
            shouldScroll ? 'max-h-[400px] overflow-y-auto pr-2' : ''
          }`}
        >
          <ul>
            {commentList.map((comment) => renderComment(comment))}
          </ul>
        </div>
      )}

      <div className="border-t p-4">
        <TaskCommentForm taskId={taskId} onCommentPosted={handleNewComment}  />
      </div>
    </div>
  );
}
