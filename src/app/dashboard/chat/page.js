"use client";

import { useState } from 'react';
import Sidebar from '@/components/Chat/Sidebar';
import ChatWindow from '@/components/Chat/ChatWindow';
import DetailsSidebar from '@/components/Chat/DetailsSidebar';

export default function ChatIndex() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-[calc(100vh-80px)] border bg-gray-50">
      <Sidebar onSelectUser={setSelectedUser} selectedUser={selectedUser} />
      <div className="flex flex-1 flex-col border-x bg-white">
        <ChatWindow user={selectedUser} />
      </div>
      <DetailsSidebar user={selectedUser} />
    </div>
  );
}
