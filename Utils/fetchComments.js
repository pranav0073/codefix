
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

          resolve(result);
        }else{
          dbo.collection("spaces").insertOne({"space_name":params.space_name, comments:[]});

        }
        db.close();
      });


    });
  })
}

/*

var comm = {
    user_name: rc.user_name,
    line_number: rc.line_number,
    user_comment: rc.user_comment
};

var payLoad = {
  rc:comm,
  space_name:msg.loc.substring(9, msg.loc.length)
}
*/

addComment = function(params){

  console.log('inside add commnet db')
  return new Promise((resolve,reject)=>{
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("codefix");
      console.log(params.space_name);
      dbo.collection("spaces").update({"space_name":params.space_name},{$push:{comments:{
            "user_code": params.rc.user_code,
            "user_name": params.rc.user_name,
            "line_number": params.rc.line_number,
            "user_comment": params.rc.user_comment,
            "file_name": params.rc.file_name

        }}},(err)=>{
          console.log(err);
        });
    })
  });
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
  fetchComments : fetchComments,
  addComment: addComment
}
