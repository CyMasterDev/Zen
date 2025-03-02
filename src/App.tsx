import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Browser } from './components/Browser';
import { useBrowserStore } from './store/browser';
import { useTheme } from './hooks/useTheme';

function App() {
  const { addTab } = useBrowserStore();
  const { currentTheme } = useTheme();

  useEffect(() => {
    // Add initial tab
    addTab({
      url: 'about:blank',
      title: 'New Tab',
    });
  }, [addTab]);

  return (
    <div className="flex h-screen theme-transition rounded-2xl" style={{
      background: currentTheme ? `linear-gradient(to bottom right, ${currentTheme.colors.background.start}, ${currentTheme.colors.background.end})` : undefined
    }}>
      <Sidebar />
      <Browser />
    </div>
  );
}

export default App;