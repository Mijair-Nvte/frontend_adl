'use client'

import Link from 'next/link'
import {
  Squares2X2Icon,
  BriefcaseIcon,
  UserIcon,
  CalendarIcon,
  PencilSquareIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PaperClipIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Squares2X2Icon },
  { href: '/dashboard/cases', label: 'Proyectos', icon: BriefcaseIcon },
  { href: '/dashboard/customers', label: 'Directorio', icon: UserIcon },
  { href: '/dashboard/calendar', label: 'Calendario', icon: CalendarIcon },
  { href: '/dashboard/tasks', label: 'Tareas', icon: PencilSquareIcon },
  { href: '/dashboard/finance', label: 'Tesorería', icon: CurrencyDollarIcon },
  { href: '/dashboard/documents', label: 'Documentos', icon: PaperClipIcon },
  { href: '/dashboard/reports', label: 'Informes', icon: ChartBarIcon },
]

export default function TopNavMenu() {
  const pathname = usePathname()

  return (
    <div className="bg-[#051d7c] text-white shadow-sm h-14 flex items-center justify-center border-b border-[#0e118c]">
      <div className="flex space-x-6 overflow-x-auto max-w-full px-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 text-sm font-semibold uppercase px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-[#1f23c9] shadow-md'
                  : 'hover:bg-white/20'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
