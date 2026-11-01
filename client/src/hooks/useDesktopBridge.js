import { useEffect } from 'react';

/**
 * Custom hook to interface with Electron Windows Desktop IPC
 */
export function useDesktopBridge(onFilesReceived) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      if (window.electronAPI.getInitialFiles) {
        window.electronAPI
          .getInitialFiles()
          .then((rawFiles) => {
            if (rawFiles && rawFiles.length > 0) {
              onFilesReceived(rawFiles);
            }
          })
          .catch(() => {});
      }

      if (window.electronAPI.onFileOpened) {
        const unsubscribe = window.electronAPI.onFileOpened((rawFiles) => {
          if (rawFiles && rawFiles.length > 0) {
            onFilesReceived(rawFiles);
          }
        });
        return unsubscribe;
      }
    }
  }, [onFilesReceived]);
}
