import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
const Database = require('better-sqlite3');
let db;

function createWindow() {
  const mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.maximize();

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  let dbPath

  if (is.dev) {
    dbPath = join(__dirname, '../../resources/course-navi.db')
  } else {
    dbPath = join(process.resourcesPath, 'resources/course-navi.db')
  }

  // 判定された正しいパスでDBを読み込む
  db = new Database(dbPath, { readonly: true })
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('fetchCourseList', (_event, { day, period }) => {
  // DB上の時限は16進数なので, 引数を基数変換
  const hexPeriod = period.map(v => v.toString(16));
  const cond = hexPeriod.map(v => `classes.period LIKE '%${v}%'`).join(' OR ');
  const query = `
  SELECT
    courses.subject,
    classes.course,
    courses.abbr,
    classes.class,
    courses.credits,
    classes.day,
    classes.period,
    courses.xMark,
    classes.id
  FROM classes
  JOIN courses ON courses.course = classes.course
  WHERE classes.id IN (
    SELECT id
    FROM classes
    WHERE classes.day = '${day}' AND (${cond})
  )
  `;

  const rows = db.prepare(query).all();

  // idでグループ化し、4単位科目をまとめる
  const rowsById = rows.reduce((acc, row) => {
    const { subject, id } = row;
    acc[subject] = acc[subject] || {};
    acc[subject][id] = acc[subject][id] || [];

    //periodを'9,A'の形式から10進数の配列にパースする
    const periodList = row.period.split(',').map(p => parseInt(p, 16));
    const newRow = { ...row, period: periodList };
    acc[subject][id].push(newRow);

    return acc;
  }, {});

  const result = Object.fromEntries(
    Object.entries(rowsById).map(([subject, data]) => [
      subject,
      Object.values(data)
    ])
  );


  return result;
})