"use client";

export default function DetailsSidebar({ user }) {
  if (!user) return null;

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <aside className="w-72 bg-gray-50 border-l p-4 h-full hidden lg:flex flex-col">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
          {getInitials(user.name)}
        </div>
        <h3 className="text-md font-semibold mt-3">{user.name}</h3>
        <span className="text-xs text-gray-500 mt-1">
          {user.page_name || 'Sin página'}
        </span>
      </div>

    </aside>
  );
}
