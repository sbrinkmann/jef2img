"use strict";

var fs = require('fs/promises');
var path = require('path');
var { createCanvas } = require('canvas');
var jdataview = require('jdataview');
var { jefRead } = require('./jefformat');
var { Pattern } = require('./pattern');

const IMAGE_TYPE = 'image/png';

var Jef2Img = function () { };

Jef2Img.prototype.convert = async function(jefFilePath, imageTargetPath){

  if (path.extname(path.basename(jefFilePath).toLowerCase()) != '.jef') {
    throw('Unsupported file type.')
  }

  let jefFile = await fs.readFile(jefFilePath);
  let jefFileStat = await fs.stat(jefFilePath);
  let jefFileSize = jefFileStat['size'];

  return await convertJef2Img(jefFile, jefFileSize, imageTargetPath);
}

let convertJef2Img = async function (input, size, imageTargetPath) {

  let pattern = new Pattern();
  let mycanvas = new createCanvas();

  let view = jdataview(input, 0, size);
  jefRead(view, pattern);
  pattern.moveToPositive();
  pattern.drawShape(mycanvas);

  let imageData = mycanvas.toBuffer(IMAGE_TYPE);

  await fs.writeFile(imageTargetPath, imageData);

  return pattern;
};

module.exports = new Jef2Img;
