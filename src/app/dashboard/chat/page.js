"use client";

import { useState } from 'react';
import Sidebar from '@/components/Chat/Sidebar';
import ChatWindow from '@/components/Chat/ChatWindow';
import DetailsSidebar from '@/components/Chat/DetailsSidebar';
export default function ChatIndex() {
  const [selectedUser, setSelectedUser] = useState(null); // contiene el objeto { psid, name, ... }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white border rounded-lg shadow">
      <Sidebar onSelectUser={setSelectedUser} selectedUser={selectedUser} />
      <ChatWindow user={selectedUser} />
         <DetailsSidebar user={selectedUser} />
    </div>
  );
}
