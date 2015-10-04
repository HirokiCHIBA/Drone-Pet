'use strict';

var docomoFace = require('./docomo-face.js');
var fs = require('fs');


docomoFace.registFace('./sample1.png', function(data, response){
 var buf = fs.readFileSync('./sample1.png');

})

