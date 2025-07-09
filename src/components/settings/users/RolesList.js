'use client';

import useApiRoles from '@/hooks/roles/useApiRoles';
import Table from '@/components/ui/Table';
import StatusBadge from '@/components/ui/StatusBadge';
import EditButton from '@/components/ui/EditButton'; // Opcional, si usas botón de ícono

export default function RolesList() {
  const { roles, loadingRoles, errorRoles } = useApiRoles();

  // Definición de columnas para tabla modular
  const roleColumns = [
    {
      label: "Rol",
      key: "name",
    },
    {
      label: "Permisos",
      key: "permissions",
      render: (role) =>
        <div className="flex flex-wrap gap-1">
          {role.permissions && role.permissions.length > 0
            ? role.permissions.map((perm, i) => (
                <StatusBadge
                  key={perm + i}
                  label={perm}
                  color="#6366f1"
                   className="text-xs"  // Puedes hacer un map dinámico para colores según permiso si quieres
                />
              ))
            : <span className="text-gray-400">Sin permisos</span>
          }
        </div>,
    },
    {
      label: "",
      key: "actions",
      render: (role) => (
        // Puedes usar EditButton (ícono) o un botón textual modular
        <EditButton onClick={() => alert(`Editar rol ${role.name}`)} />
        // O si quieres texto:
        // <button className="text-indigo-600 hover:underline text-xs">Editar</button>
      ),
    },
  ];

 return (
    <section className="bg-white rounded-xl p-4 w-full max-w-screen-lg mx-auto">
      <h3 className="text-lg font-semibold mb-4">Roles</h3>

      <div className="overflow-x-auto w-full">
        <Table
          columns={roleColumns}
          data={roles}
          isLoading={loadingRoles}
          error={errorRoles}
        />
      </div>
    </section>
  );

}
