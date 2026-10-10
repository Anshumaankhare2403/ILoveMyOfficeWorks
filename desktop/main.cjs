const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

// Handle squirrel / Windows installer events if any
try {
  if (require('electron-squirrel-startup')) {
    app.quit();
  }
} catch {
  // electron-squirrel-startup is optional
}

let mainWindow = null;
let initialFilesToOpen = [];

// Determine whether we are in dev mode
const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';

// Parse command line arguments for files passed on launch
function parseLaunchArgs(argv) {
  const fileArgs = [];
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (arg && !arg.startsWith('--') && !arg.startsWith('-') && fs.existsSync(arg)) {
      try {
        const stat = fs.statSync(arg);
        if (stat.isFile()) {
          fileArgs.push(arg);
        }
      } catch {
        // ignore
      }
    }
  }
  return fileArgs;
}

// Check single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();

      const newFiles = parseLaunchArgs(commandLine);
      if (newFiles.length > 0) {
        loadAndSendFiles(newFiles);
      }
    }
  });
}

/**
 * Detect Ghostscript executable on system (Windows/Linux/Mac)
 */
async function getGhostscriptCmd() {
  const candidates = ['gswin64c', 'gswin32c', 'gs'];
  for (const cmd of candidates) {
    try {
      await execFileAsync(cmd, ['--version'], { timeout: 4000 });
      return cmd;
    } catch {
      // ignore
    }
  }
  return null;
}

/**
 * Reads local files and sends them to renderer
 */
function readLocalFile(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    let type = 'application/octet-stream';
    if (ext === '.pdf') type = 'application/pdf';
    else if (ext === '.png') type = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') type = 'image/jpeg';
    else if (ext === '.webp') type = 'image/webp';
    else if (ext === '.docx') type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (ext === '.pptx') type = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    else if (ext === '.xlsx') type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    else if (ext === '.csv') type = 'text/csv';

    return {
      name: fileName,
      path: filePath,
      size: buffer.length,
      type: type,
      data: buffer.toString('base64'),
    };
  } catch (err) {
    console.error('Error reading file:', filePath, err);
    return null;
  }
}

function loadAndSendFiles(filePaths) {
  if (!mainWindow || !mainWindow.webContents) return;
  const files = filePaths.map(readLocalFile).filter(Boolean);
  if (files.length > 0) {
    mainWindow.webContents.send('file-opened-with-app', files);
  }
}

function createWindow() {
  const iconPath = path.join(__dirname, 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.png');

  mainWindow = new BrowserWindow({
    width: 1320,
    height: 880,
    minWidth: 1000,
    minHeight: 660,
    frame: false, // Frameless window with custom Luxury Sage title bar
    titleBarStyle: 'hidden',
    backgroundColor: '#FAF8F4',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    show: false, // Show when ready to prevent flicker
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
      spellcheck: false,
    },
  });

  // Track window state changes for maximize button
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-maximize-changed', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-maximize-changed', false);
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // If files were supplied at launch, send them now
    if (initialFilesToOpen.length > 0) {
      setTimeout(() => loadAndSendFiles(initialFilesToOpen), 600);
    }
  });

  // Load URL or File
  if (isDev) {
    loadDevUrl();
  } else {
    loadProdDist();
  }

  // Handle external links safely in system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
}

function loadDevUrl() {
  const devUrl = 'http://localhost:5173';
  mainWindow.loadURL(devUrl).catch(() => {
    console.log('Dev server at localhost:5173 not ready yet, retrying in 1.5s...');
    setTimeout(() => {
      if (mainWindow) {
        mainWindow.loadURL(devUrl).catch(() => {
          console.log('Falling back to local dist build...');
          loadProdDist();
        });
      }
    }, 1500);
  });
}

function loadProdDist() {
  // Try relative dist paths (standalone desktop directory vs bundled)
  const candidatePaths = [
    path.join(__dirname, 'client', 'dist', 'index.html'),
    path.join(__dirname, '..', 'client', 'dist', 'index.html'),
    path.join(process.resourcesPath, 'client', 'dist', 'index.html'),
  ];

  let foundPath = null;
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      foundPath = p;
      break;
    }
  }

  if (foundPath) {
    mainWindow.loadFile(foundPath);
  } else {
    console.error('Could not locate built client dist/index.html in candidate paths:', candidatePaths);
    mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
      <body style="font-family:system-ui;padding:40px;background:#FAF8F4;color:#262D20;text-align:center;">
        <h2>Build Required</h2>
        <p>Please build the client application before launching production desktop:</p>
        <pre style="background:#E8E1D5;padding:12px;border-radius:8px;display:inline-block;">npm run build --prefix client</pre>
      </body>
    `));
  }
}

// IPC Handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

ipcMain.handle('dialog-open-files', async (_event, options = {}) => {
  if (!mainWindow) return { canceled: true, files: [] };

  const defaultFilters = [
    { name: 'All Supported Documents', extensions: ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'docx', 'pptx', 'xlsx', 'csv', 'html', 'txt'] },
    { name: 'PDF Documents (*.pdf)', extensions: ['pdf'] },
    { name: 'Images (*.jpg, *.png, *.webp)', extensions: ['jpg', 'jpeg', 'png', 'webp'] },
    { name: 'Office Documents (*.docx, *.pptx, *.xlsx)', extensions: ['docx', 'pptx', 'xlsx', 'csv'] },
    { name: 'All Files (*.*)', extensions: ['*'] },
  ];

  const result = await dialog.showOpenDialog(mainWindow, {
    title: options.title || 'Select Files — ILoveMyOfficeWorks',
    properties: options.multiple !== false ? ['openFile', 'multiSelections'] : ['openFile'],
    filters: options.filters || defaultFilters,
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true, files: [] };
  }

  const loadedFiles = result.filePaths.map(readLocalFile).filter(Boolean);
  return { canceled: false, files: loadedFiles };
});

ipcMain.handle('dialog-save-file', async (_event, options = {}) => {
  if (!mainWindow) return { canceled: true };
  const result = await dialog.showSaveDialog(mainWindow, {
    title: options.title || 'Save Document — ILoveMyOfficeWorks',
    defaultPath: options.defaultPath || 'document.pdf',
    filters: options.filters || [
      { name: 'PDF Document (*.pdf)', extensions: ['pdf'] },
      { name: 'All Files (*.*)', extensions: ['*'] },
    ],
  });
  return result;
});

ipcMain.handle('file-save-buffer', async (_event, { filePath, dataBase64, reveal = false }) => {
  try {
    const buffer = Buffer.from(dataBase64, 'base64');
    fs.writeFileSync(filePath, buffer);
    if (reveal) {
      shell.showItemInFolder(filePath);
    }
    return { success: true, filePath };
  } catch (err) {
    console.error('Error saving file buffer:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('shell-show-in-folder', async (_event, filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      shell.showItemInFolder(filePath);
      return { success: true };
    }
    return { success: false, error: 'File does not exist' };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('shell-open-external', async (_event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('app-get-initial-files', async () => {
  if (!initialFilesToOpen.length) return [];
  return initialFilesToOpen.map(readLocalFile).filter(Boolean);
});

ipcMain.handle('app-get-system-info', async () => {
  const gsCmd = await getGhostscriptCmd();
  return {
    platform: process.platform,
    arch: process.arch,
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node,
    ghostscriptAvailable: Boolean(gsCmd),
    ghostscriptCommand: gsCmd,
  };
});

ipcMain.handle('ghostscript-compress', async (_event, { dataBase64, quality = 'screen' }) => {
  const gsCmd = await getGhostscriptCmd();
  if (!gsCmd) {
    return { success: false, error: 'Ghostscript is not installed on this system.' };
  }

  const tempDir = app.getPath('temp');
  const tempInput = path.join(tempDir, `ilmow_in_${Date.now()}.pdf`);
  const tempOutput = path.join(tempDir, `ilmow_out_${Date.now()}.pdf`);

  try {
    const inBuffer = Buffer.from(dataBase64, 'base64');
    fs.writeFileSync(tempInput, inBuffer);

    const pdfSetting = quality === 'screen' ? '/screen' : quality === 'ebook' ? '/ebook' : '/printer';
    const args = [
      '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.4',
      `-dPDFSETTINGS=${pdfSetting}`,
      '-dNOPAUSE',
      '-dQUIET',
      '-dBATCH',
      `-sOutputFile=${tempOutput}`,
      tempInput,
    ];

    await execFileAsync(gsCmd, args, { timeout: 30000 });

    if (fs.existsSync(tempOutput)) {
      const outBuffer = fs.readFileSync(tempOutput);
      return {
        success: true,
        data: outBuffer.toString('base64'),
        size: outBuffer.length,
      };
    } else {
      return { success: false, error: 'Ghostscript output file was not generated.' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  } finally {
    try { if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput); } catch {}
    try { if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput); } catch {}
  }
});

// App Lifecycle
app.whenReady().then(() => {
  initialFilesToOpen = parseLaunchArgs(process.argv);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
