'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
const fs = require('fs');
const path = require('path');
const shortcuts = require('electron-shortcut-loader')(path.join(__dirname, './shortcuts'));
const togglify = require('electron-togglify-window');
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

app.on('window-all-closed', () => {
	app.quit();
});

app.on('ready', () => {
	shortcuts.register();

	win = togglify(new BrowserWindow({
		width: 800,
		height: 600,
		resizable: true,
		center: true,
		show: true,
		'skip-taskbar': true,
		'web-preferences': {
			'preload': path.join(__dirname, 'browser.js')
		}
	}), {
		animation: conf.get('animation')
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

app.on('menuitem-click', (e, args) => {
	if (e.event === 'toggle-animation') {
		// Change animation of toggle
		var animation = conf.get('animation') === 'hide' ? 'scale' : 'hide';
		conf.set('animation', animation);
		togglify.changeAnimation(win, animation);
	} else {
  	BrowserWindow.getFocusedWindow().webContents.send(e.event);
	}
});

app.on('shortcut-press', (e) => {
	switch (e.event) {
		case 'toggle':
			win.toggle();
			break;
	}
});
