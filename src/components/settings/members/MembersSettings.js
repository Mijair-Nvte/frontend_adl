'use client';

import { useState } from 'react';
import InviteMemberForm from './InviteMemberForm';
import MemberList from './MemberList';
import {
  Users,
  MailPlus,
} from 'lucide-react';

export default function MembersSettings() {
  const [refresh, setRefresh] = useState(false);

  const handleInvited = () => setRefresh(!refresh);

  return (
    <div className="bg-white rounded shadow-md p-6 md:p-8 space-y-6 border border-gray-100 max-w-4xl mx-auto">
      {/* Encabezado con ícono */}
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6 text-indigo-500" />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Gestión de miembros</h2>
          <p className="text-sm text-gray-500">
            Invita nuevos colaboradores y visualiza las invitaciones pendientes.
          </p>
        </div>
      </div>

      {/* Sección de formulario */}
      <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 font-medium">
          <MailPlus className="w-4 h-4 text-indigo-400" />
          Invitar nuevo miembro
        </div>
        <InviteMemberForm onInvited={handleInvited} />
      </div>

      {/* Lista de miembros */}
      <div>
        <MemberList key={refresh} />
      </div>
    </div>
  );
}
