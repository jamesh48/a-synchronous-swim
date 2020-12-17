const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for urlx ' + req.url);
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else if (req.method === 'GET') {
    // Generate random swim command
    console.log('test here');
    let directions = ['left', 'right', 'up', 'down'];
    let randomDir = directions[Math.floor(Math.random() * directions.length)];
    // Send swim command to response request
    res.writeHead(200, headers);
    res.write(randomDir);
    res.end();
  }

  next(); // invoke next() at the end of a request to help with testing!
};
