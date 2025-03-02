import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  isOpen: boolean;
  themeId: string;
  proxyType: 'ultraviolet' | 'bare' | 'epoxy' | 'libcurl';
  searchEngine: 'google' | 'duckduckgo' | 'bing';
  sidebarCollapsed: boolean;
  setSettingsOpen: (isOpen: boolean) => void;
  setThemeId: (themeId: string) => void;
  setProxyType: (type: 'ultraviolet' | 'bare' | 'epoxy' | 'libcurl') => void;
  setSearchEngine: (engine: 'google' | 'duckduckgo' | 'bing') => void;
  toggleSidebar: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isOpen: false,
      themeId: 'dark',
      proxyType: 'ultraviolet',
      searchEngine: 'google',
      sidebarCollapsed: false,
      setSettingsOpen: (isOpen) => set({ isOpen }),
      setThemeId: (themeId) => set({ themeId }),
      setProxyType: (proxyType) => set({ proxyType }),
      setSearchEngine: (searchEngine) => set({ searchEngine }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'browser-settings',
    }
  )
);