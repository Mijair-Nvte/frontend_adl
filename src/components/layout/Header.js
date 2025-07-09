'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BellAlertIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/react/24/outline';
import * as Tooltip from '@radix-ui/react-tooltip';
import CurrentTime from './CurrentTime';
import ProfileMenu from './ProfileMenu';
import useSidebarStore from '@/store/sidebarStore';
import useApiNotifications from '@/hooks/Notifications/useApiNotifications';
import NotificationDropdown from './NotificationDropdown';
import { Menu, ArrowRight } from 'lucide-react';



export default function Header() {
  const toggleMobile = useSidebarStore((s) => s.toggleMobile);
  const toggleExpanded = useSidebarStore((s) => s.toggleExpanded);
  const { notifications } = useApiNotifications();
  const [messages] = useState(2);
  const expanded = useSidebarStore((s) => s.expanded);

  return (
  <header className="h-16 bg-white border-b flex items-center px-4 ">


      {/* Botón menú móvil */}
      <button
        className="md:hidden mr-2 p-2 hover:bg-white/20 rounded"
        onClick={() => useSidebarStore.getState().toggleMobile()}
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Botón ocultar/mostrar desktop */}
      <button
        className="hidden md:block mr-4 p-2 hover:bg-white/20 rounded"
        onClick={() => useSidebarStore.getState().toggleExpanded()}
        aria-label="Ocultar/mostrar menú"
      >
        {expanded ? <Menu className="w-6 h-6 text-gray-700" /> : <ArrowRight className="w-6 h-6 text-gray-700" />}

      </button>


      {/* Logo responsivo (Next 15 Link sin <a>) */}
      <Link
        href="/dashboard"
        className="flex items-center md:hidden"
      >
        <Image
          src="/logo_solvex_b.png"
          alt="Logo Duralux"
          width={550}
          height={550}
          className="h-10 w-auto"
        />
      </Link>


      {/* Hora centrada en desktop */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
        <div className="bg-white/10 px-4 py-1.5 rounded  border backdrop-blur-sm text-gray-700">
          <CurrentTime />
        </div>
      </div>

      {/* Iconos a la derecha */}
      <div className="ml-auto flex items-center space-x-4">
        <NotificationDropdown />

        <ProfileMenu />
      </div>
    </header>
  );
}


