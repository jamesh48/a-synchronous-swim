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
      //var message = messageQueue.dequeue();
      res.writeHead(200, headers);
      res.write('up');
      res.end();
      next();
    } else if (req.url === '/background.jpg') {
      console.log('serving background image');
      //let data = fs.readFileSync(this.backgroundImageFile);
      //if (data) {
        // res.writeHead(200, headers);
        // res.write(data)
      //  } else {
      //   res.writeHead(404, headers);
      // }
      // res.end();
      fs.readFile(this.backgroundImageFile, function(err, data) {
        if (err) {
          res.writeHead(404, headers);
          res.end();
          next();
        } else {
         res.writeHead(200, headers);
         res.write(data);
         res.end();
         next();
        }
      });
    }
  } else if (req.method === 'POST' && req.url === '/background.jpg') {
    let prevSavedFile = this.backgroundImageFile;
    fs.writeFile(this.backgroundImageFile, req.data, function(err) {
      if (err) {
        res.writeHead(404, headers);
        res.end();
        next();
      } else {
        res.writeHead(201, headers);
        res.write(prevSavedFile);
        res.end();
        next();
      }
    });
  }
  // next(); // invoke next() at the end of a request to help with testing!
};