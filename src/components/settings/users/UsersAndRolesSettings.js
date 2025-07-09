'use client';

import UserList from './UserList';
import RolesList from './RolesList';

export default function UsersAndRolesSettings() {
  return (
    <div className="space-y-8 w-full max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">
        Gestión de Usuarios, Roles y Permisos
      </h2>

      <UserList />
      <RolesList />
    </div>
  );
}
