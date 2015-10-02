'use strict';
const ipc = require('ipc');

ipc.on('change-theme', () => {
	document.querySelector('._sidebar-footer-link._sidebar-footer-light').click();
});
