'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
const Menu = require('menu');

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

function createMainWindow () {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		resizable: true,
		center: true,
		show: false,
		'skip-taskbar': true
	});

	win.loadUrl(`http://devdocs.io/`);
	win.on('closed', onClosed);

	return win;
}

function toggleWindow() {
	mainWindow[mainWindow.isVisible() ? 'minimize' : 'restore']();
}

function onClosed() {
	// deref the window
	// for multiple windows store them in an array
	mainWindow = null;
}

// prevent window being GC'd
let mainWindow;

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', function () {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', function () {
	var template = [{
		label: 'Devdocs',
    submenu: [{
		  label: 'Hide Electron',
		  accelerator: 'Esc',
		  selector: 'hide:'
		}]
	}];

	var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

	mainWindow = createMainWindow();

	// Register shortcut
	var globalShortcut = require('global-shortcut');
	globalShortcut.register('CommandOrControl+?', toggleWindow);
});

app.on('will-quit', function () {
	globalShortcut.unregisterAll();
})
