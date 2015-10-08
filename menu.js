'use strict';

const app = require('app');
const appName = app.getName();
const BrowserWindow = require('browser-window');

function sendEvent(e) {
  BrowserWindow.getFocusedWindow().webContents.send(e);
}

module.exports = {
  darwin: [{
    label: appName,
    submenu: [{
      label: `About ${appName}`,
      role: 'about'
    }, {
      type: 'separator'
    }, {
      label: 'Hide',
      accelerator: 'Esc',
      selector: 'hide:'
    }, {
      label: 'Quit',
      accelerator: 'Cmd+Q',
      click() {
        app.quit();
      }
    }]
  }, {
    label: 'View',
    submenu: [{
      label: 'Change theme',
      click() {
        sendEvent('change-theme');
      }
    }]
  }]
};
