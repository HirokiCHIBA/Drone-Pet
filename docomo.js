'use strict';

var Client = require('node-rest-client').Client;
var client = new Client();
var API_KEY = "2e4c6258357756306d2f776b52674159676a6545336454706b2f47552f5542387441734d7652336d615a35";
var USER_TOKEN = "eyJhbGciOiJSUzUxMiJ9.eyJqdGkiOiJneFBjMFQwcHVuUjlseE4tUHM3QmZnIiwiaWF0IjoxNDQzODkwNjM2LCJleHAiOjE0NTk0NDI2MzYsInVzZXIiOiJOT0xxOGVRbjNhcGRrWGdUM2IxWlBnIn0.p_nnYByP1jjnHFRVYNS50-Q7V5YWnArCzS9F06rcIgb56_7PnpYQwORCZ7AWx0FH4Zar8_XHBT_JrbqGlzOPclLg5KDnWsXuydK8AdQq1xy_dkQy-pcWBDRZ-Dz9PXZZwmwlUmcLowDTizH_wOMyfYyXNoiSJwjOmkqGlYyv8ku-uDftXXG9gQCdArQ1G7pDTYDXBL6xhMSfs73L9fj6JwBz_NjUlAfq7j6bGYXkQGm53WrJNhPK0reE-agubxJRA1iWFIvFFxa3ndFBApkGcg5O6jNzYZ_xO_g-nk_dGlXpb-7EF-BHl_2L8ieeKqpAegY22cuqXHbjnyp0px6_0ghiGM4H1sw571cyY0CCnXMLvBIYC8ONCxZ_3fw02k0Pi02ZsE4onSkXxbRHbUkEa8Q89SRLf5dYdZuSto4DN1wHqIFef6m9p9ns9c2-HRwFEPy6Km4jfeHl2dDbK6cTTsCXighsQ5jgwUTIAj9xR1kCJzCBQsrRF6xeI0bUDVJhcciWyttcuyidzKgrBv1E2cbqddRqKcWqxGF7cYepCg-zsX2bRpALrCa7VaE-yJBeKI9hTdHYq3YFHYvFkEmAV2g6yx3IC6bCkOn-up6zde1dGby2uHlSO8pwmRuihg1aEUklLNYereiMXDkn7Yl1ss_Ik0yvmQLo-24jTytG0YY"
var BASE_URL = "https://api.apigw.smt.docomo.ne.jp/imageRecognition/v1/"

module.exports = {

  //画像認識を行う
  recogImage: function(recog, buf, callback){
    var args = {
      data: buf.toString('utf8'),
      headers: {
        "Content-Type": "application/octet-stream"
      }
    }
    var url = BASE_URL+"recognize?APIKEY="+API_KEY+"&recog="+recog;
    client.post(url, args, function(data, response){
      callback(data, response);
    });
  },

  //画像蓄積領域に画像をアップロードする
  storeImg: function(label, name, buf, callback){
    var args = {
      data: buf.toString('utf8'),
      headers:{
        "Content-Type": "application/octet-stream"
      }
    }
    var url = BASE_URL+"userCategory/uploadTmpImage?APIKEY="+API_KEY+"&token="+USER_TOKEN+"&label="+label+"&name="+name;
    client.post(url, args, function(data, response){
      callback(data, response);
    });
  },

  //画像蓄積領域の画像一覧を取得
  getPictures: function(callback){
    var url = BASE_URL+"userCategory/tmpImages?APIKEY="+API_KEY+"&token="+USER_TOKEN;
    client.get(url, {}, function(data, response){
      callback(data, response);
    });
  },

  // 画像蓄積領域の画像を削除
  deletePictures: function(callback){
    var url = BASE_URL+"userCategory/clearTmpImages?APIKEY="+API_KEY+"&token="+USER_TOKEN;
    client.post(url, {}, function(data, response){
      callback(data, response);
    });
  },

  //データセットを作成
  createDataSet: function(id, callback){
    var args = {
      data: {
        dataSetId:id
      },
      headers: {
        "Content-Type":"application/json;charset=UTF-8"
      }
    }
    var url = BASE_URL+"userCategory/createTmpImageDataSet?APIKEY="+API_KEY+"&token="+USER_TOKEN;
    client.post(url, args, function(data, response){
      callback(data, response);
    });
  },

  //データセット一覧を取得
  getDataSets: function(id, callback){
    var args = {
      headers:{
        "Content-Type": "application/json;charset=UTF-8"
      }
    }
    var url = BASE_URL+"userCategory/creatingTmpImageDataSetStatus?APIKEY="+API_KEY+"&token="+USER_TOKEN+"&creatingTmpImageDataSetJobId="+id;
    client.get(url, args, function(data, response){
      callback(data, response);
    });
  },

  // データセットのステータスを表示
  getDataSetStatus: function(id, callback){
    var args = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    }
    var url = BASE_URL+"userCategory/creatingTmpImageDataSetStatus?APIKEY="+API_KEY+"&token="+USER_TOKEN;
    client.get(url, args, function(data, response){
      callback(data, response);
    });
  },

  // データセット削除
  deleteDataSet: function(id, callback){
    var args = {
      data: {
        dataSetId: id
      },
      headers:{
        "Content-Type": "application/json;charset=UTF-8"
      }
    }
    var url = BASE_URL+"userCategory/deleteDataSet?APIKEY="+API_KEY+"&token="+USER_TOKEN;
    client.post(url, args, function(data, response){
      callback(data, response);
    });
  },

  // 辞書作成
  createDict: function(dicPram, dicId, dataSetIds, callback){
    var args = {
      data:{
        dicPram: dicPram,
        dicId: dicId,
        dataSetIds: dataSetIds
      },
      headers:{
        "Content-Type": "application/json;charset=UTF-8"   
      }
    }
    var url = BASE_URL+"/userCategory/createDic?APIKEY="+API_KEY+"&token="+USER_TOKEN;
    client.post(url, arg, function(data, responses){
      callback(data, response);
    });
  },

  // 辞書一覧取得
  getDict: function(callback){
    var args = {
      headers: {
        "Content-Type":"application/json;charset=UTF-8"
      }
    }
    var url = BASE_URL+"?API_KEY="+API_KEY+"&token="+USER_TOKEN;
    client.get(url, args, function(data, response){
      callback(data, response);
    });
  },

  // 辞書削除
  deleteDict: function(id, callback){
    var args = {
      data: {
        dicId: id
      },
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    }
    var url = BASE_URL+"?APIKEY="+API_KEY+"&token="+USER_TOKEN;
    client.post(url, args, function(data, response){
      callback(data, response);
    });
  },

  //ユーザカテゴリーを取得
  createUserCategory: function(category, callback){
    var args = {
      data: {
        name: category
      },
      headers:{
        "Content-Type": "application/json;charset=UTF-8"
      }
    }
    var url = BASE_URL+"userCategory/createUserCategory?APIKEY="+API_KEY+"&token="+USER_TOKEN;
    client.post(url, args, function(data, response){
     callback(data, response);
    });
  },

  //ユーザカテゴリー一覧を取得
  getUserCategory: function(callback){
    var args = {
      headers:{
        "Content-Type": "application/json;charset=UTF-8"
      }
    }
    var url = BASE_URL+"userCategory/userCategories?APIKEY="+API_KEY+"&token="+USER_TOKEN;
    client.get(url, args, function(data, response){
      callback(data, response);
    });
  },

  // ユーザカテゴリを削除
  deleteUserCategory: function(categoryId, callback){
    var args = {
      data: {
        categoryId: categoryId
      },
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    }
    var url = BASE_URL+"userCategory/deleteUserCategory?APIKEY="+API_KEY+"&token="+USER_TOKEN;
    client.post(url, args, function(data, response){
      callback(data, response);
    });
  },

  // ユーザカテゴリをデプロイ
  deployUserCategory: function(categoryId, dicId, callback){
    var args = {
      data:{
        categoryId: categoryId,
        dicId: dicId
      },
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    }
    var url = BASE_URL+"userCategory/deployDic?APIKEY="+API_KEY+"&token="+USER_TOKEN;
    client.post(url, args, function(data, response){
      callback(data, response);
    });
  }
}
