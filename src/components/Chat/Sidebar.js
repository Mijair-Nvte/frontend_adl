'use client';

import { useState, useEffect } from 'react';
import { useChatConversations } from '@/hooks/chat/useApiChat';

export default function Sidebar({ onSelectUser, selectedUser }) {
  const [users, setUsers] = useState([]);
  const { conversations, loading } = useChatConversations();

  const avatarImages = [
    'https://images.pexels.com/photos/8374296/pexels-photo-8374296.jpeg',
    'https://images.pexels.com/photos/4443130/pexels-photo-4443130.jpeg',
    'https://images.pexels.com/photos/39866/entrepreneur-startup-start-up-man-39866.jpeg',
    'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg',
    'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
    'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg',
  ];

  const fixedAvatars = [
    { name: 'Patrick', avatar: avatarImages[0] },
    { name: 'Doris', avatar: avatarImages[1] },
    { name: 'Emily', avatar: avatarImages[2] },
    { name: 'Steve', avatar: avatarImages[3] },
  ];

  useEffect(() => {
    const usersWithAvatars = conversations.map((user, index) => ({
      ...user,
      avatar: avatarImages[index % avatarImages.length],
    }));
    setUsers(usersWithAvatars);
  }, [conversations]);

  const truncate = (text, maxLength = 16) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength - 1) + '…' : text;
  };

  return (
    <aside className="w-80 bg-white border-r h-screen p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Chats</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar mensajes o usuarios"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="flex space-x-3 mb-6 overflow-x-auto">
        {fixedAvatars.map((user, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full border-2 border-blue-400 object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <span className="text-xs mt-1">{user.name}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.psid}
            onClick={() => onSelectUser(user)}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer mb-2 transition hover:bg-gray-100 ${
              selectedUser?.psid === user.psid ? 'bg-blue-100' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-sm flex items-center gap-2">
                  {user.name}
                  {user.page_name && (
                    <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full max-w-[120px] truncate">
                      {truncate(user.page_name)}
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {user.typing ? (
                    <span className="text-blue-500 font-medium">escribiendo...</span>
                  ) : (
                    user.last_message || 'Sin mensajes'
                  )}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-400 whitespace-nowrap">
              {user.last_time || 'Ahora'}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
