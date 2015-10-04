'use strict';

var base64 = require('node-base64-image');
var Client = require('node-rest-client').Client;
var client = new Client();

var API_KEY = "2e4c6258357756306d2f776b52674159676a6545336454706b2f47552f5542387441734d7652336d615a35";
var USER_TOKEN = "eyJhbGciOiJSUzUxMiJ9.eyJqdGkiOiJneFBjMFQwcHVuUjlseE4tUHM3QmZnIiwiaWF0IjoxNDQzODkwNjM2LCJleHAiOjE0NTk0NDI2MzYsInVzZXIiOiJOT0xxOGVRbjNhcGRrWGdUM2IxWlBnIn0.p_nnYByP1jjnHFRVYNS50-Q7V5YWnArCzS9F06rcIgb56_7PnpYQwORCZ7AWx0FH4Zar8_XHBT_JrbqGlzOPclLg5KDnWsXuydK8AdQq1xy_dkQy-pcWBDRZ-Dz9PXZZwmwlUmcLowDTizH_wOMyfYyXNoiSJwjOmkqGlYyv8ku-uDftXXG9gQCdArQ1G7pDTYDXBL6xhMSfs73L9fj6JwBz_NjUlAfq7j6bGYXkQGm53WrJNhPK0reE-agubxJRA1iWFIvFFxa3ndFBApkGcg5O6jNzYZ_xO_g-nk_dGlXpb-7EF-BHl_2L8ieeKqpAegY22cuqXHbjnyp0px6_0ghiGM4H1sw571cyY0CCnXMLvBIYC8ONCxZ_3fw02k0Pi02ZsE4onSkXxbRHbUkEa8Q89SRLf5dYdZuSto4DN1wHqIFef6m9p9ns9c2-HRwFEPy6Km4jfeHl2dDbK6cTTsCXighsQ5jgwUTIAj9xR1kCJzCBQsrRF6xeI0bUDVJhcciWyttcuyidzKgrBv1E2cbqddRqKcWqxGF7cYepCg-zsX2bRpALrCa7VaE-yJBeKI9hTdHYq3YFHYvFkEmAV2g6yx3IC6bCkOn-up6zde1dGby2uHlSO8pwmRuihg1aEUklLNYereiMXDkn7Yl1ss_Ik0yvmQLo-24jTytG0YY"
var BASE_URL = "https://api.apigw.smt.docomo.ne.jp/puxImageRecognition/v1/faceRecognition"

module.exports = {
  registFace: function(path, callback){
    var options = {localFile: true, string: true}
    base64.base64encode(path, function (err, image){
      if(err){
        console.log(err);
        return;
      }
      var url = BASE_URL+"APIKEY="+API_KEY;
      var args = {
        data: {
          "mode": "register",
          "inputBase64": image
        },
        headers:{
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
      client.post(url, args, function(data, response){
        console.log(data);
        callback(data, response);
      });
    });
  },
  recogFace: function(buf, callback){
    var url = BASE_URL+"?APIKEY="+API_KEY;
    var arg = {
      data: {
        "mode": "register",
        "inputBase64": buf.toString('base64')
      },
      headers:{
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
    client.post(url, args, function(data, response){
      console.log(data);
      callback(data, response);
    });
  }
}
