const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const treeKill = require('tree-kill');
const { exec } = require('child_process');

let pythonProcess = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
     icon: path.join(__dirname, 'icon.ico'),  
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true
    }
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    win.loadFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  }

 

  // Kill backend if window is closed directly
  win.on('closed', () => {
    if (pythonProcess && typeof pythonProcess.pid === 'number' && !pythonProcess.killed) {
      treeKill(pythonProcess.pid, 'SIGTERM');
    }
  });
}

app.setPath('userData', path.join(app.getPath('temp'), 'CreoMate'));


function startPythonBackend() {
  let exePath;
  let args = [];

  if (app.isPackaged) {
    // When packaged, run the compiled executable (e.g., from PyInstaller)
    exePath = path.join(process.resourcesPath, 'app.exe');
  } else {
    // In dev mode, run Python script with the Python interpreter
    exePath = 'python';  // or 'python3' depending on your OS
    args = [path.join(__dirname, 'backend', 'app.py')];
  }

  pythonProcess = spawn(exePath, args, {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  pythonProcess.stdout.on('data', (data) => {
    process.stdout.write(`PYTHON: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    process.stderr.write(`PYTHON ERROR: ${data}`);
  });

  pythonProcess.on('error', (err) => {
    console.error('Failed to start backend:', err);
  });
}

app.whenReady().then(() => {
  startPythonBackend();
  createWindow();
});



app.on('before-quit', () => {
  if (pythonProcess && typeof pythonProcess.pid === 'number' && !pythonProcess.killed) {
    treeKill(pythonProcess.pid, 'SIGTERM');
  }

  // Fallback: kill any remaining app.exe by name
  exec('taskkill /F /IM app.exe', (error, stdout, stderr) => {
    if (error) {
      console.error(`taskkill error: ${error.message}`);
    }
    if (stderr) {
      console.error(`taskkill stderr: ${stderr}`);
    }
    if (stdout) {
      console.log(`taskkill stdout: ${stdout}`);
    }
  });
});

