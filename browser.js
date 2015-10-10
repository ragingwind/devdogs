'use strict';
const ipc = require('ipc');

ipc.on('change-theme', () => {
	document.querySelector('._sidebar-footer-link._sidebar-footer-light').click();
});

ipc.on('go-offline', () => {
	document.querySelector('nav._nav a[href="/offline"]').click();
});

ipc.on('go-about', () => {
	document.querySelector('nav._nav a[href="/about"]').click();
});

ipc.on('go-news', () => {
	document.querySelector('nav._nav a[href="/news"]').click();
});

ipc.on('go-tips', () => {
	document.querySelector('nav._nav a[href="/help"]').click();
});
