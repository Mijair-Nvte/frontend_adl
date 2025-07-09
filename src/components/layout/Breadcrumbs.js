// src/components/layout/Breadcrumbs.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SEGMENT_LABELS } from '@/lib/breadcrumbs';

export default function Breadcrumbs() {
  const pathname = usePathname();             // p.ej. "/dashboard/cases"
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((seg, idx) => {
    const href  = '/' + segments.slice(0, idx + 1).join('/');
    const label = SEGMENT_LABELS[seg] ||
                  seg.charAt(0).toUpperCase() + seg.slice(1);
    return { href, label };
  });

  return (
    <nav aria-label="breadcrumb" className="px-4 pt-4">
      <ol className="inline-flex items-center space-x-2 text-sm text-gray-500">
      
        {crumbs.map(({ href, label }, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li
              key={href}
              className={isLast ? 'text-gray-900 font-medium' : ''}
            >
              {isLast ? (
                label
              ) : (
                <>
                  <Link href={href} className="hover:text-gray-700">
                    {label}
                  </Link>
                  <span className="mx-1">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
