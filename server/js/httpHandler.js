const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
// const backgroundImg = require('../background.jpg');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {

  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    next();
  } else if (req.method === 'GET') {
    if (req.url === '/') {
      res.writeHead(200, headers);
      res.end(messageQueue.dequeue());
      next();
    } else if (req.url === '/background.jpg') {
      console.log('serving background image');
      fs.readFile(this.backgroundImageFile, (err, data) => {
        if (err) {
          res.writeHead(404, headers);
          console.log(err);
        } else {
         res.writeHead(200, headers);
         res.write(data);
        //  res.write(data, 'binary');
        }
        res.end();
        next();
      });
    }
  } else if (req.method === 'POST' && req.url === '/background.jpg') {
    var fileData = Buffer.alloc(0);

    req.on('data', (chunk) => {
      fileData = Buffer.concat([fileData, chunk]);
    });

    req.on('end', () => {
      var file = multipart.getFile(fileData);
      fs.writeFile(this.backgroundImageFile, file.data, function(err) {
        if (err) {
          res.writeHead(404, headers);
          res.end();
          next();
        } else {
          res.writeHead(201, headers);
          res.end(file.data);
          next();
        }
      });
    })
  }
  // next(); // invoke next() at the end of a request to help with testing!
};