import { create } from 'zustand';

const useSidebarStore = create((set) => ({
  mobileOpen: false,  // Controla el drawer móvil
  expanded: true,     // Controla el sidebar en desktop
  setMobileOpen: (open) => set({ mobileOpen: open }),
  toggleMobile: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
  toggleExpanded: () => set((s) => ({ expanded: !s.expanded })),
}));

export default useSidebarStore;
