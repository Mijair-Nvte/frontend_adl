"use client";

import { useState, useEffect } from 'react';
import { useChatConversations } from '@/hooks/chat/useApiChat';
import FacebookChatListener from '@/components/Chat/FacebookChatListener';

export default function Sidebar({ onSelectUser, selectedUser }) {
  const [users, setUsers] = useState([]);
  const { conversations } = useChatConversations();

  useEffect(() => {
    setUsers(conversations);
  }, [conversations]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <aside className="w-80 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Buscar mensajes..."
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.psid}
            onClick={() => {
              onSelectUser(user);
              setUsers(prev =>
                prev.map(u =>
                  u.psid === user.psid ? { ...u, unread_count: 0 } : u
                )
              );
            }}
            className={`flex items-center p-3 gap-3 border-b hover:bg-blue-50 cursor-pointer ${
              selectedUser?.psid === user.psid ? 'bg-blue-100' : ''
            }`}
          >
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              {getInitials(user.name)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">
                {user.typing ? (
                  <span className="text-blue-500">escribiendo...</span>
                ) : (
                  user.last_message || 'Sin mensaje'
                )}
              </p>
            </div>
            {user.unread_count > 0 && (
              <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                {user.unread_count}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Listeners activos para cada conversación */}
      {users.map((user) => (
        <FacebookChatListener
          key={user.psid}
          psid={user.psid}
          onNewMessage={() => {
            setUsers(prev =>
              prev.map(u =>
                u.psid === user.psid
                  ? { ...u, unread_count: (u.unread_count || 0) + 1 }
                  : u
              )
            );
          }}
        />
      ))}
    </aside>
  );
}
