'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
const fs = require('fs');
const ipc = require('ipc');
const Menu = require('menu');
const path = require('path');
const Tray = require('tray');
const Shortcut = require('electron-shortcut');
const Positioner = require('electron-positioner');
const Configstore = require('configstore');
const pkg = require(path.join(__dirname, './package.json'));
const conf = new Configstore(pkg.name, {animation: 'scale'});

if (process.env.NODE_ENV !== 'production') {
  require('crash-reporter').start();
  require('electron-debug')();
}

require('electron-menu-loader')(path.join(__dirname, './menu'), [process.platform]);

// prevent window being GC'd
let win = null;
let tray = null;
let search = null;

app.on('window-all-closed', () => {
  app.quit();
});

function loadWindow(argument) {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    center: true,
    show: true,
    // 'skip-taskbar': true,
    'web-preferences': {
      'preload': path.join(__dirname, 'browser.js')
    }
  });

  win.loadUrl('http://devdocs.io');
  app.dock.show();

  win.on('closed', () => {
    // deref the window
    // for multiple windows store them in an array
    app.dock.hide();
    win = null;
  });

  const page = win.webContents;

  page.on('dom-ready', () => {
    page.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'));
    win.show();
  });
}

app.on('ready', () => {
  app.dock.hide();

  tray = new Tray(path.join(__dirname, 'res', 'trayTemplate.png'));
  tray.setContextMenu(Menu.buildFromTemplate([{
    label: 'Open DevDogs (⌘ + ⇧ + /)',
    click: function() {
      if (win === null) {
        loadWindow();
      } else {
        win.focus();
      }
    }
  }, {
    label: 'Quit (⌘Q)',
    click: function() {
      app.quit();
    }
  }]));

  search = new BrowserWindow({
    width: 280,
    show: false,
    frame: false,
    'skip-taskbar': true
  });
  search.setVisibleOnAllWorkspaces(true);
  search.loadUrl('http://devdocs.io');
  search.on('blur', function() {
    search.hide();
  });

  let searchPosition = new Positioner(search);
  searchPosition.move('topRight');

  const searchPage = search.webContents;

  searchPage.on('dom-ready', () => {
    searchPage.insertCSS(fs.readFileSync(path.join(__dirname, 'search.css'), 'utf8'));
    searchPage.executeJavaScript(fs.readFileSync(path.join(__dirname, 'search.js'), 'utf8'));

    ipc.on('selected', function(event, href) {
      search.hide();
      if (win) {
        win.focus();
      } else {
        loadWindow();
      }
      win.loadUrl(href);
    });

    ipc.on('search-exit', function() {
      search.hide();
    });

    ipc.on('win-exit', function() {
      win.close();
    });
  });

  // register a shortcuts
  Shortcut.register('Command+?', {
    autoRegister: false,
    cmdOrCtrl: true
  }, () => {
    if (win) {
      if (!win.isMinimized()) {
        win.minimize();
      } else {
        win.restore();
      }
    } else {
      if (search.isVisible()) {
        search.hide();
      } else {
        search.show();
      }
    }
  });

});

app.on('menuitem-click', (e, args) => {
  BrowserWindow.getFocusedWindow().webContents.send(e.event);
});
