'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
const GlobalShortcut = require('global-shortcut');
const fs = require('fs');
const path = require('path');
const shortcuts = require('electron-shortcut-loader')(path.join(__dirname, './shortcuts'));

if (process.env.NODE_ENV !== 'production') {
	require('crash-reporter').start();
	require('electron-debug')();
}

require('electron-menu-loader')(path.join(__dirname, './menu'), [process.platform]);

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

app.on('window-all-closed', () => {
	app.quit();
});

app.on('ready', () => {
	shortcuts.register();

	win = new BrowserWindow({
		width: 800,
		height: 600,
		resizable: true,
		center: true,
		show: true,
		'skip-taskbar': true,
		'web-preferences': {
			'preload': path.join(__dirname, 'browser.js')
		}
	});

	win.loadUrl('http://devdocs.io');

	win.on('closed', () => {
		// deref the window
		// for multiple windows store them in an array
		win = null;
	});

	win.on('restore', () => {
		win.focus();
	});

	const page = win.webContents;

	page.on('dom-ready', () => {
		page.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'));
		win.show();
	});
});

app.on('will-quit', () => {
	shortcuts.unregister();
});

app.on('menuitem-click', (e) => {
  BrowserWindow.getFocusedWindow().webContents.send(e.event);
});

app.on('shortcut-press', (e) => {
	switch (e.event) {
		case 'toggle':
			toggleWindow();
			break;
	}
});
