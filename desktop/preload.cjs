const { contextBridge, ipcRenderer } = require('electron');

/**
 * Preload script exposing safe Electron APIs to the renderer
 */
contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,
  platform: process.platform,

  // Window Controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  onMaximizeChange: (callback) => {
    const handler = (_event, isMax) => callback(isMax);
    ipcRenderer.on('window-maximize-changed', handler);
    return () => ipcRenderer.removeListener('window-maximize-changed', handler);
  },

  // Native File Dialogs & Disk Operations
  openFileDialog: (options) => ipcRenderer.invoke('dialog-open-files', options),
  saveFileDialog: (options) => ipcRenderer.invoke('dialog-save-file', options),
  saveBufferToFile: (options) => ipcRenderer.invoke('file-save-buffer', options),
  showInFolder: (filePath) => ipcRenderer.invoke('shell-show-in-folder', filePath),
  openExternal: (url) => ipcRenderer.invoke('shell-open-external', url),

  // File Opened with Application (CLI args / Windows Double Click)
  getInitialFiles: () => ipcRenderer.invoke('app-get-initial-files'),
  onFileOpened: (callback) => {
    const handler = (_event, fileData) => callback(fileData);
    ipcRenderer.on('file-opened-with-app', handler);
    return () => ipcRenderer.removeListener('file-opened-with-app', handler);
  },

  // System & Engine Capabilities
  getSystemInfo: () => ipcRenderer.invoke('app-get-system-info'),
  compressWithGhostscript: (options) => ipcRenderer.invoke('ghostscript-compress', options),
});
