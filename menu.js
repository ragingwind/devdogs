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
      label: 'About ' + app.getName(),
      click() {
        sendEvent('go-about');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Change theme',
      click() {
        sendEvent('change-theme');
      }
    }, {
      label: 'Offline',
      click() {
        sendEvent('go-offline');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Hide',
      accelerator: 'Esc',
      selector: 'hide:'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Cmd+Q',
      click() {
        app.quit();
      }
    }]
  }, {
    label: 'Help',
    submenu: [{
      label: 'News',
      click() {
        sendEvent('go-news');
      }
    }, {
      label: 'Tips',
      click() {
        sendEvent('go-tips');
      }
    }]
  }]
};
