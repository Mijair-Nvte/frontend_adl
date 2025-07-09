'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useSidebarStore from '@/store/sidebarStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { hasRole } from '@/utils/accessControl';

import {
  Squares2X2Icon,
  BriefcaseIcon,
  UserIcon as DirectoryIcon,
  PencilSquareIcon,
  CalendarIcon,
  PaperClipIcon,
  ChartBarIcon,
  CurrencyDollarIcon, ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

import { Settings, X } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { mobileOpen, expanded, setMobileOpen } = useSidebarStore();

  const router = useRouter();

  const links = [
    { href: '/dashboard', icon: Squares2X2Icon, text: 'Dashboard' },
    { href: '/dashboard/cases', icon: BriefcaseIcon, text: 'Projects' },
    { href: '/dashboard/customers', icon: DirectoryIcon, text: 'Customers' },
    { href: '/dashboard/tasks', icon: PencilSquareIcon, text: 'Tasks' },
    { href: '/dashboard/calendar', icon: CalendarIcon, text: 'Calendar' },
    { href: '/dashboard/chat', icon: ChatBubbleLeftRightIcon, text: 'Chat Facebook' },
    { href: '/dashboard/documents', icon: PaperClipIcon, text: 'Documents' },
    { href: '/dashboard/reports', icon: ChartBarIcon, text: 'Reports', roles: ['Administrador'] },
    { href: '/dashboard/treasury', icon: CurrencyDollarIcon, text: 'Billing' },
  ];

  const baseLinkClasses = 'flex items-center px-4 py-3 rounded transition';
  const hoverClasses = 'hover:bg-white/10';
  const activeClasses = 'bg-white/20 text-white';

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`
          h-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white
          transition-all duration-200 z-40
          ${mobileOpen ? 'fixed top-0 left-0 w-55 translate-x-0' : 'fixed top-0 left-0 w-55 -translate-x-full'} 
          md:relative md:translate-x-0
          ${expanded ? 'md:w-55' : 'md:w-20'}
        `}
      >
        <div className="flex items-center justify-center h-16 border-b border-white/20">
          <Link href="/dashboard" className="flex items-center justify-center">
            <Image
              src={expanded ? '/logo_solvex_b.png' : '/logo_solvex_b.png'}
              alt="Logo"
              width={expanded ? 920 : 40}
              height={expanded ? 520 : 40}
              className={expanded ? 'h-10 w-auto' : 'h-8 w-auto'}
            />
          </Link>
        </div>

        <div className="flex items-center justify-between px-4">
          <button
            className="md:hidden p-2"
            onClick={() => useSidebarStore.getState().setMobileOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="overflow-y-auto h-[calc(100vh-4rem)] text-sm px-2 pt-5">
          <p className={`px-2 pt-4 text-xs font-semibold uppercase text-gray-300 transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
            Navegación
          </p>
          <ul className="mt-2 space-y-1">
            {links.map(({ href, icon: Icon, text, roles }) => {
              if (roles && !hasRole(roles)) return null;

              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`
            ${baseLinkClasses} ${hoverClasses}
            ${isActive ? activeClasses : 'text-gray-200'}
          `}
                  >
                    <Icon className={`w-5 h-5 ${expanded ? 'mr-3' : ''}`} />
                    <span className={`font-medium transition-opacity duration-200 ${expanded ? 'opacity-100 inline' : 'opacity-0 hidden'}`}>
                      {text}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {hasRole(['Administrador']) && (
            <>
              <p className={`px-2 pt-4 text-xs font-semibold uppercase text-gray-300 transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                Settings
              </p>
              <ul className="mt-2">
                <li>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      router.push('/dashboard/settings');
                    }}
                    className={`${baseLinkClasses} ${hoverClasses} text-gray-200 w-full text-left`}
                  >
                    <Settings className={`w-5 h-5 ${expanded ? 'mr-3' : ''}`} />
                    <span className={`font-medium transition-opacity duration-200 ${expanded ? 'opacity-100 inline' : 'opacity-0 hidden'}`}>
                      General Settings
                    </span>
                  </button>
                </li>
              </ul>
            </>
          )}


        </nav>
      </aside>
    </>
  );
}
