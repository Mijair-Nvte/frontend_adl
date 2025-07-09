'use client';

import { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';
import FilterButton from '@/components/ui/FilterButton';

export default function FilterDropdown({ children, title = "Filtrar", width = 'w-80' }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);

  // Detecta clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Detecta tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <FilterButton title={title} onClick={() => setOpen(!open)} />

      {open && (
        <div
          className={`
            z-50 bg-white shadow-xl rounded-xl p-4 
            ${isMobile 
              ? 'fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-sm' 
              : `absolute right-0 mt-2 ${width}`
            }
          `}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-gray-700">Filtros</h4>
            <button onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:underline">
              Cerrar
            </button>
          </div>
          {/* Pasamos onClose al hijo */}
          {typeof children === 'function' ? children(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  );
}
