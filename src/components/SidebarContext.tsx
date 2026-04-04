'use client';

import { useState, createContext, useContext } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  toggle: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(prev => !prev);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
