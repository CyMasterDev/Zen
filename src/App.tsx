import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Browser } from './components/Browser';
import { useBrowserStore } from './store/browser';
import { useTheme } from './hooks/useTheme';

function App() {
  const { addTab } = useBrowserStore();
  const { currentTheme } = useTheme();

  useEffect(() => {
    addTab({
      url: 'about:blank',
      title: 'New Tab',
    });

    if ('serviceWorker' in navigator) {
      console.log("service worker");
      navigator.serviceWorker.register('/uv/sw.js', {
        scope: '/uv/service',
        type: 'classic',
        updateViaCache: 'none'
      }).catch(console.error);
    }
  }, [addTab]);

  return (
    <div className="flex h-screen transition-colors rounded-2xl text-light-1" style={{
      background: currentTheme ? `linear-gradient(to bottom right, ${currentTheme.colors.background.start}, ${currentTheme.colors.background.end})` : undefined
    }}>
      <Sidebar />
      <Browser />
    </div>
  );
}

export default App;