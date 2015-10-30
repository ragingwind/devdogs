'use strict';

const app = require('app');
const appName = app.getName();

module.exports = {
  darwin: [{
    label: appName,
    submenu: [{
      label: 'About ' + app.getName(),
      event: 'about'
    }, {
      type: 'separator'
    }, {
      label: 'Change theme',
      event: 'theme'
    }, {
      label: 'Change toggle animation',
      event: 'toggle-animation'
    }, {
      label: 'Offline',
      event: 'offline'
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
      event: 'news'
    }, {
      label: 'Tips',
      event: 'tips'
    }]
  }]
};
