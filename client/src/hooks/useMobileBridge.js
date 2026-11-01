import { useEffect } from 'react';
import { TOOL_CONFIGS } from '../constants/tools';

/**
 * Custom hook to interface with Android Flutter mobile bridge and handle URL tool query routing
 */
export function useMobileBridge({
  activeTab,
  onNavigate,
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

      // Check URL query parameters for deep linked tools
      const queryTool = searchParams.get('tool');
      if (queryTool && TOOL_CONFIGS[queryTool] && onNavigate) {
        onNavigate(`/tools/${queryTool}`);
        if (setShowSplash) {
          setShowSplash(false);
        }
      }
    } catch {
      // ignore
    }

    // Expose global navigation helpers for native WebViews (Electron & Flutter)
    window.setAppTab = (tab) => {
      if (onNavigate) {
        if (!tab || tab === 'home') {
          onNavigate('/');
        } else {
          onNavigate(`/tools/${tab}`);
        }
      }
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
  }, [activeTab, onNavigate, setShowSplash, onFilesReceived]);
}
