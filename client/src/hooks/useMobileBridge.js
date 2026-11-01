import { useEffect } from 'react';
import { TOOL_CONFIGS } from '../constants/tools';

/**
 * Custom hook to interface with Android Flutter mobile bridge and handle URL tool query/hash routing
 */
export function useMobileBridge({
  activeTab,
  setActiveTab,
  setShowSplash,
  onFilesReceived,
}) {
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const isMobile =
        searchParams.get('mobile') === 'true' ||
        (typeof window !== 'undefined' &&
          (window.isMobileApp || window.FlutterBridge));

      if (isMobile && setShowSplash) {
        setShowSplash(false);
      }

      const urlTool =
        searchParams.get('tool') ||
        window.location.hash.replace('#', '').replace('tool=', '');

      if (urlTool && TOOL_CONFIGS[urlTool]) {
        setActiveTab(urlTool);
        if (setShowSplash) {
          setShowSplash(false);
        }
      }
    } catch {
      // ignore
    }

    // Expose tab control globally for native webview bridges
    window.setAppTab = (tab) => {
      setActiveTab(tab);
    };
    window.getAppTab = () => activeTab;

    const handleFlutterFiles = (e) => {
      const rawFiles = e.detail;
      if (rawFiles && rawFiles.length > 0 && onFilesReceived) {
        onFilesReceived(rawFiles);
      }
    };

    window.addEventListener('flutter-files-received', handleFlutterFiles);

    return () => {
      window.removeEventListener('flutter-files-received', handleFlutterFiles);
      delete window.setAppTab;
      delete window.getAppTab;
    };
  }, [activeTab, setActiveTab, setShowSplash, onFilesReceived]);
}
