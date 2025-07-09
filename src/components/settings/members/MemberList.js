'use client';
import { useEffect, useState } from 'react';
import { getAllInvitations } from '@/services/invitations/invitationService';

export default function MemberList() {
  const [invitations, setInvitations] = useState([]);

  const fetchInvitations = async () => {
    try {
      const data = await getAllInvitations();
      setInvitations(data);
    } catch {
      setInvitations([]);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Invitaciones enviadas</h2>
      <ul className="space-y-2">
        {invitations.map((inv) => (
          <li
            key={inv.id}
            className="border px-4 py-2 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{inv.email}</p>
              <p className="text-sm text-gray-500">
                Enviado: {new Date(inv.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Enviado por: {inv.inviter?.name ?? 'Desconocido'}
              </p>
              <p className="text-sm text-gray-500">
                Rol: {inv.role?.name ?? 'No asignado'}
              </p>

              {inv.used_at ? (
                <span className="text-green-600 text-sm">Aceptado</span>
              ) : (
                <span className="text-yellow-600 text-sm">Pendiente</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
