'use client'
import { createContext, useContext, useEffect, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // Drawer en móvil

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar-expanded');
      const isMobile = window.innerWidth < 768;

      if (stored !== null) {
        setExpanded(stored === 'true');
      } else {
        setExpanded(!isMobile);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', expanded.toString());
  }, [expanded]);

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
