import React from "react";
import Image from "next/image";

export default function AssignedLawyers({ lawyers = [] }) {
  if (!lawyers.length) return null;

  return (
    <div className="p-6 text-sm text-gray-700 space-y-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Asignados</h4>
      <ul className="space-y-1">
        {lawyers.map((lawyer) => {
          // Ruta de avatar (profile.avatar) o null
          const avatar =
            lawyer.profile?.avatar ||
            lawyer.avatar || // Si algún endpoint lo trae directo
            null;

          // Iniciales
          const initials = lawyer.name
            ? lawyer.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
            : "U";

          return (
            <li key={lawyer.id} className="flex items-center gap-2 text-sm text-gray-700">
              {avatar ? (
                <div className="relative w-8 h-8">
                  <Image
                    src={avatar}
                    alt={lawyer.name || "Avatar"}
                    fill
                    sizes="32px"
                    className="rounded-full border-2 border-white shadow object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
              )}
              <span className="truncate">{lawyer.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
