'use strict';

var docomo = require('./docomo.js');
var fs = require('fs');

var buf = fs.readFileSync('sample1.png');
console.log(buf);

console.log("Read picture");
docomo.storeImg("Droid", "Sample1.png", buf, function(data, response){
  console.log("Stored picture");
  console.log(data);
  console.log(response);
  docomo.getPictures(function(data, response){
    console.log("Get memory");
    console.log(data);
    docomo.createDataSet("1", function(data, response){
      console.log("Created Data set");
      console.log(data);
      console.log(response.status);
      var id = data.creatingTmpImageDataSetJobId;
      docomo.getDataSets(id, function(data, response){
        console.log("Got data sets");
        console.log(data);
      });
    });
  });
});

