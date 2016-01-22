'use strict';

const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const fs = require('fs');
const path = require('path');
const Shortcut = require('electron-shortcut');
const togglify = require('electron-togglify-window');
const windowStateKeeper = require('electron-window-state');
const Configstore = require('configstore');

const pkg = require(path.join(__dirname, './package.json'));
const conf = new Configstore(pkg.name, {animation: 'scale'});

if (process.env.NODE_ENV !== 'production') {
	require('crash-reporter').start({
		companyName: pkg.author.name,
		submitURL: pkg.repository
	});
	require('electron-debug')();
}

require('electron-menu-loader')(path.join(__dirname, './menu'), [process.platform]);

// prevent window being GC'd
let win = null;

app.on('window-all-closed', () => {
	app.quit();
});

app.on('ready', () => {
	let mainWindowState = windowStateKeeper({
		defaultWidth: 800,
		defaultHeight: 600
	});

	win = togglify(new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		resizable: true,
		center: true,
		show: true,
		skipTaskbar: true,
		webPreferences: {
			preload: path.join(__dirname, 'browser.js')
		}
	}), {
		animation: conf.get('animation')
	});

	mainWindowState.manage(win);

	win.loadURL('http://devdocs.io');

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

	// register a shortcuts
	Shortcut.register('Command+?', {
		autoRegister: false,
		cmdOrCtrl: true
	}, () => {
		win.toggle();
	});
});

app.on('menuitem-click', e => {
	if (e.event === 'toggle-animation') {
		// Change animation of toggle
		const animation = conf.get('animation') === 'hide' ? 'scale' : 'hide';
		conf.set('animation', animation);
		togglify.changeAnimation(win, animation);
	} else {
		BrowserWindow.getFocusedWindow().webContents.send(e.event);
	}
});
