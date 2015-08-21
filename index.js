'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
const Menu = require('menu');
const GlobalShortcut = require('global-shortcut');

// prevent window being GC'd
let mainWindow = null;

function toggleWindow() {
	mainWindow[mainWindow.isVisible() ? 'minimize' : 'restore']();
}

function registerShorcuts() {
	GlobalShortcut.register('CommandOrControl+?', toggleWindow);
}

function unregisterShortcuts() {
	GlobalShortcut.unregisterAll();
}

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
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

	registerShorcuts();

	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		resizable: true,
		center: true,
		show: false,
		'skip-taskbar': true
	});

	mainWindow.loadUrl('http://devdocs.io');

	mainWindow.on('closed', function () {
		// deref the window
		// for multiple windows store them in an array
		mainWindow = null;

		unregisterShortcuts();
	});
});
