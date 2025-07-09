'use client';

import { Filter } from 'lucide-react';

export default function FilterButton({
  icon: Icon = Filter,
  title = 'Filtrar',
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      className={[
        "p-2 text-blue-600 rounded-md border hover:bg-gray-100 transition",
        className
      ].join(" ")}
      title={title}
      {...props}
    >
      {Icon && <Icon size={16} />}
    </button>
  );
}
