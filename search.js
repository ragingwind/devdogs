'use strict';
const ipc = require('ipc');

document.getElementsByClassName('_sidebar')[0]
  .addEventListener('click', function(event) {
    ipc.send('selected', event.target.href);
  });

document.addEventListener('keyup', function(event) {
  if (event.keyCode == 27) {
    ipc.send('search-exit');
  }
});