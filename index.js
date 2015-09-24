'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
const Menu = require('menu');
const GlobalShortcut = require('global-shortcut');

require('crash-reporter').start();

// prevent window being GC'd
let win = null;

function toggleWindow() {
	if (win.isVisible() && win.isFocused()) {
		// minimize the window if it is is focused on
		win.minimize();
	}
	else if (win.isVisible() && !win.isFocused()) {
		// brint window in front of others if it is not minized,
		// in behind of the other windows
		win.focus();
	} else if (win.isMinimized()) {
		// restore window from dock
		win.restore();
	}
}

function registerShorcuts() {
	GlobalShortcut.register('CommandOrControl+?', toggleWindow);
}

function unregisterShortcuts() {
	GlobalShortcut.unregisterAll();
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', () => {
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

	win = new BrowserWindow({
		width: 800,
		height: 600,
		resizable: true,
		center: true,
		show: true,
		'skip-taskbar': true
	});

	win.loadUrl('http://devdocs.io');

	win.on('closed' => () {
		// deref the window
		// for multiple windows store them in an array
		win = null;

		unregisterShortcuts();
	});

	win.on('restore' => () {
		win.focus();
	});
});
