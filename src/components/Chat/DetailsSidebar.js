export default function DetailsSidebar({ user }) {
  if (!user) return null;

  return (
    <aside className="w-72 bg-gray-50 border-l p-4 h-full hidden lg:block">
      <h2 className="text-lg font-semibold mb-4">Detalles</h2>

      <div className="flex flex-col items-center mb-6">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover border"
        />
        <h3 className="text-md font-bold mt-2">{user.name}</h3>
        <span className="text-sm text-gray-500 mt-1">
          {user.page_name || 'Sin página'}
        </span>
      </div>

      <div className="text-sm text-gray-700 space-y-2">
        <p>
          <span className="font-medium">Último mensaje:</span>{' '}
          {user.last_message || 'Sin mensaje'}
        </p>
        <p>
          <span className="font-medium">Última vez:</span>{' '}
          {user.last_time || 'Desconocido'}
        </p>
        <p>
          <span className="font-medium">PSID:</span> {user.psid}
        </p>
      </div>
    </aside>
  );
}
