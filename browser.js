'use strict';
const ipc = require('ipc');

ipc.on('theme', () => {
	document.querySelector('._sidebar-footer-link._sidebar-footer-light').click();
});

ipc.on('offline', () => {
	document.querySelector('nav._nav a[href="/offline"]').click();
});

ipc.on('about', () => {
	document.querySelector('nav._nav a[href="/about"]').click();
});

ipc.on('news', () => {
	document.querySelector('nav._nav a[href="/news"]').click();
});

ipc.on('tips', () => {
	document.querySelector('nav._nav a[href="/help"]').click();
});

document.addEventListener('keyup', function(event) {
  if (event.keyCode == 27) {
    ipc.send('win-exit');
  }
});
