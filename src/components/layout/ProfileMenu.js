'use client';
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import {
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from "next/navigation";
import useAuthStore from '@/store/authStore';

function getInitials(name = "") {
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0] || "";
  return (words[0][0] + (words[1][0] || "")).toUpperCase();
}
function stringToColor(str) {
  const colors = [
    "bg-pink-500", "bg-yellow-500", "bg-blue-500",
    "bg-green-500", "bg-red-500", "bg-indigo-500", "bg-purple-500"
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function ProfileMenu() {
  const { user, logout } = useAuthStore(); // ✅ CAMBIO
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-full transition "
      >
        {user?.profile?.avatar ? (
          <Image
            src={user.profile.avatar}
            alt="Avatar"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border border-white"
          />

        ) : (
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-bold border  border-white ${stringToColor(user.name)}`}
          >
            {getInitials(user.name)}
          </div>
        )}
        <span className="hidden md:block font-semibold  text-gray-700">{user.name}</span>
        <ChevronDownIcon className="w-4 h-4 text-white" />
      </button>

      {open && (
        <div className="absolute right-0 mt-4 w-60 bg-white text-gray-800 rounded-xl shadow-xl z-[100] overflow-hidden border animate-fadeIn">
          <div className="px-4 py-3">
            <p className="text-sm font-semibold">{user.name}</p>
            {user.username && (
              <p className="text-xs text-gray-500">@{user.username}</p>
            )}
          </div>
          <div className="border-t border-gray-100" />
          <button
            onClick={() => {
              setOpen(false);
              router.push("/dashboard/profile");
            }}
            className="w-full px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <UserIcon className="w-4 h-4" /> Perfil
          </button>

          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
