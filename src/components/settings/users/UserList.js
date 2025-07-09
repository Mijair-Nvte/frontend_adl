'use client';

import { useState, useEffect } from 'react';
import useApiUsersWithRoles from '@/hooks/roles/useApiUsersWithRoles';
import useApiRoles from '@/hooks/roles/useApiRoles';
import useAssignRoles from '@/hooks/roles/useAssignRoles';
import CustomSelect from '@/components/ui/Select';
import Button from '@/components/ui/Button';

import Table from '@/components/ui/Table';
import EditButton from "@/components/ui/EditButton";
import { showToast } from "@/utils/toast";

// ---- Modal para editar el rol ----
function EditUserRoleModal({ isOpen, onClose, user, roles, loading, onAssign }) {
  const [selectedRole, setSelectedRole] = useState('');

  // Al abrir el modal, pon el rol actual del usuario (si tiene)
  useEffect(() => {
    if (user && user.roles && user.roles.length > 0 && roles.length > 0) {
      const found = roles.find(r => r.name === user.roles[0]);
      setSelectedRole(found ? found.id : '');
    } else {
      setSelectedRole('');
    }
  }, [user, roles]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    await onAssign(selectedRole);
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-xl w-[90vw] max-w-md p-6 animate-fadeIn">
        <h2 className="text-lg font-bold mb-4">Editar rol de {user.name}</h2>
        <form onSubmit={handleSave}>
          <CustomSelect
            name="role"
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            options={roles.map(role => ({
              value: role.id,
              label: role.name
            }))}
            placeholder="Selecciona un rol..."
          />
          <div className="flex justify-end mt-6 gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Lista de usuarios con edición de roles ----
export default function UserList() {
  const { usersWithRoles, loadingUsersWithRoles, errorUsersWithRoles, refetch } = useApiUsersWithRoles();
  const { roles, loadingRoles } = useApiRoles();
  const { assignRoles, loading: assigning } = useAssignRoles();
  const [editUser, setEditUser] = useState(null);

  // Columnas para tabla modular
  const userColumns = [
    {
      label: "Nombre",
      key: "name",
    },
    {
      label: "Email",
      key: "email",
    },
    {
      label: "Rol(es)",
      key: "roles",
      render: (user) =>
        user.roles && user.roles.length > 0 ? (
          user.roles.map((role) => (
            <span
              key={role}
              className="inline-block bg-indigo-50 text-indigo-700 rounded px-2 py-1 mr-1 text-xs"
            >
              {role}
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        ),
    },
    {
      label: "",
      key: "actions",
      render: (user) => (
        <EditButton onClick={() => setEditUser(user)} />
      ),
    },
  ];

  // Al guardar, refresca la lista desde backend
  const handleAssignRole = async (roleId) => {
    await assignRoles(editUser.id, [roleId]);
    refetch();
    showToast({
      type: "success",
      message: "Rol actualizado",
      description: `El rol de ${editUser.name} se actualizó correctamente.`,
      duration: 3500,
    });
  };
return (
<section className="bg-white rounded-xl p-4 w-full max-w-screen-lg mx-auto">
  <h3 className="text-lg font-semibold mb-4">Usuarios</h3>

  {/* Contenedor responsivo para la tabla */}
  <div className="overflow-x-auto w-full">
    <Table
      columns={userColumns}
      data={usersWithRoles}
      isLoading={loadingUsersWithRoles}
      error={errorUsersWithRoles}
    />
  </div>

  {/* Modal integrado */}
  <EditUserRoleModal
    isOpen={!!editUser}
    onClose={() => setEditUser(null)}
    user={editUser}
    roles={roles}
    loading={assigning || loadingRoles}
    onAssign={handleAssignRole}
  />
</section>

);

}