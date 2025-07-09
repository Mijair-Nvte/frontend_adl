'use client';
import { useEffect, useState } from 'react';
import CustomSelect from '@/components/ui/Select'; // Tu select modular
import useApiRoles from '@/hooks/roles/useApiRoles';
import useAssignRoles from '@/hooks/roles/useAssignRoles';

export default function EditUserRoleModal({ isOpen, onClose, user, onSuccess }) {
  const { roles, loadingRoles } = useApiRoles();
  const { assignRoles, loading } = useAssignRoles();
  const [selectedRole, setSelectedRole] = useState('');

  // Formatear opciones para el Select
  const roleOptions = roles.map(role => ({
    value: role.id,
    label: role.name,
  }));

  // Establece el rol actual cuando cambias de usuario
  useEffect(() => {
    if (user && user.roles && user.roles.length > 0 && roles.length > 0) {
      // Busca el id del primer rol del usuario en el array de roles
      const currentRole = roles.find(r => r.name === user.roles[0]);
      setSelectedRole(currentRole ? currentRole.id : '');
    } else {
      setSelectedRole('');
    }
  }, [user, roles]);

  // Guardar cambios
  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    try {
      await assignRoles(user.id, [selectedRole]); // Solo asigna el seleccionado
      onSuccess && onSuccess(); // Actualizar lista de usuarios en el padre si quieres
      onClose();
    } catch (e) {
      // Aquí podrías mostrar toast de error
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Editar rol de usuario</h2>
        <form onSubmit={handleSave}>
          <CustomSelect
            name="role"
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            options={roleOptions}
            placeholder="Selecciona un rol..."
          />
          <div className="flex justify-end mt-6 gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded text-gray-600"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 text-white"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
