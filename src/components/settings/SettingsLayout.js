'use client';

import { useState } from 'react';
import {
  Mail,
  Users,
  Link,
  Menu
} from 'lucide-react';

import GoogleDriveSettings from './GoogleDriveSettings';
import UsersAndRolesSettings from './users/UsersAndRolesSettings';
import MembersSettings from './members/MembersSettings';
import EmailSettings from './emailsettings/EmailSettings';
import IntegrationCards from './integrations/IntegrationCards';

const sections = [
  { key: 'integrations', label: 'Integraciones', icon: Link },
  { key: 'users', label: 'Usuarios y roles', icon: Users },
  { key: 'members', label: 'Miembros', icon: Users },
  { key: 'email-settings', label: 'Correo SMTP', icon: Mail },
];

export default function SettingsLayout() {
  const [activeSection, setActiveSection] = useState('integrations');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-4 gap-4 relative">

      {/* Botón menú en móvil */}
      <div className="flex justify-between items-center md:hidden mb-4">
        <h1 className="text-xl font-bold capitalize">{activeSection}</h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Backdrop + Sidebar para móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-60  bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="absolute left-0 top-14 bottom-0 w-64 bg-white border-r p-4 space-y-2 overflow-y-auto"
            // 👆 Aquí el top-14 ajusta el margen top
            onClick={(e) => e.stopPropagation()}
          >
            {sections.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveSection(key);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-4 py-2 rounded-md text-left transition ${activeSection === key
                    ? 'bg-blue-100 text-blue-800 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                  }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sidebar en desktop */}
      <aside className="hidden md:block w-64 bg-white border rounded-lg p-4 space-y-2">
        {sections.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`flex items-center gap-2 w-full px-4 py-2 rounded-md text-left transition ${activeSection === key
                ? 'bg-blue-100 text-blue-800 font-semibold'
                : 'hover:bg-gray-100 text-gray-700'
              }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </aside>

      {/* Contenido dinámico */}
      <main className="flex-1 space-y-4 max-w-screen-lg mx-auto">

        <div className="hidden md:block">
          <h1 className="text-2xl font-bold capitalize">{activeSection}</h1>
        </div>

        {activeSection === 'integrations' && <IntegrationCards />}

        {activeSection === 'users' && <UsersAndRolesSettings />}
        {activeSection === 'members' && <MembersSettings />}
        {activeSection === 'email-settings' && <EmailSettings />}
      </main>
    </div>
  );
}
