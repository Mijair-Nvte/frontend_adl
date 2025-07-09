'use client';

import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { showToast } from '@/utils/toast';
import { sendInvitation } from '@/services/invitations/invitationService';
import { fetchRoles } from '@/services/roles/roleService';

export default function InviteMemberForm({ onInvited }) {
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener los roles al cargar el componente
  useEffect(() => {
    fetchRoles()
      .then(setRoles)
      .catch(() =>
        showToast({
          type: 'error',
          message: 'Error al cargar roles',
          description: 'No se pudieron obtener los roles disponibles',
        })
      );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !roleId) return;

    setLoading(true);
    try {
      await sendInvitation({ email, role_id: roleId });

      showToast({
        type: 'success',
        message: 'Invitación enviada',
        description: `Se envió una invitación a ${email}`,
      });

      setEmail('');
      setRoleId('');
      onInvited();
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 422 && message?.includes('email')) {
        showToast({
          type: 'error',
          message: 'Correo ya registrado o invitado',
          description: 'Ese correo ya está en uso o ha recibido una invitación',
        });
      } else {
        showToast({
          type: 'error',
          message: 'Error al enviar invitación',
          description: 'Intenta nuevamente o contacta al administrador',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 items-end w-full max-w-3xl">
      <div className="flex-1">
        <Input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo del nuevo miembro"
          required
        />
      </div>

      <div className="w-52">
        <label className="block text-sm text-gray-700 font-medium mb-1">Rol</label>
        <select
          name="role_id"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
          required
        >
          <option value="">Selecciona un rol</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        icon={Mail}
        variant="primary"
        loading={loading}
        disabled={!email || !roleId || loading}
      >
        Invitar
      </Button>
    </form>
  );
}
