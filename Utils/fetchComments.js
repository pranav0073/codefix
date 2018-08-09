
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://admin:admin1234@ds115592.mlab.com:15592/codefix";

fetchComments = function(params){
  return new Promise((resolve,reject)=>{
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("codefix");
      //dbo.collection("spaces").findOne({space_name:params.space_name})
      dbo.collection("spaces").findOne({space_name:params.space_name},(err,result)=>{

        if(err)
          reject(err);
        if(result){
          console.log('resilt display');
          console.log(result);
          resolve(result);
        }else{
          dbo.collection("spaces").insertOne({"space_name":params.space_name, comments:[]});

        }
        db.close();
      });


    });
  })
}

addSpace = function(params){
  return new Promise((resolve,reject)=>{
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("codefix");
      dbo.collection("spaces").insertOne({"space_name":params.space_name, comments:[]},(err,result)=>{
        if(err)
          throw err;
        resolve(result);
      });
    })
  });


  }


module.exports = {
  addSpace: addSpace,
  fetchComments : fetchComments
}
