import { create } from 'zustand';

const useSidebarStore = create((set) => ({
  mobileOpen: false,           // controla el drawer en móvil
  expanded: true,              // controla la visibilidad en escritorio
  setMobileOpen: (open) => set({ mobileOpen: open }),
  toggleMobile: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
  toggleExpanded: () => set((s) => ({ expanded: !s.expanded })),
}));

export default useSidebarStore;
