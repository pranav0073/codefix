var express = require('express');
var app = require('express')();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var process = require('process');

var path = require('path');
var formidable = require('formidable');

var Comment = require(__dirname+'/Utils/fetchComments');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', function(req, res){
  res.render(__dirname + '/pages/index',{files:[],comments:[]});
});

app.get('/project', function(req, res){
  res.render(__dirname + '/pages/index',{files:[],comments:[]});
});

app.get('/about', function(req, res){
  fs.readdir(__dirname+'/trackFiles',(err,files)=>{
    console.log(err);
    console.log(files);
    res.render(__dirname + '/pages/index',{files:files});
  })

});

app.get('/project/*', function(req, res){
  //create a folder

  var param = req.url.substring(9, req.url.length);
  console.log('param value' +param);
  process.umask = 0;
  fs.mkdir(__dirname+`/test-${param}`,0777,(err)=>{

    if(err){
      console.log(err);
      if(err.code === 'EEXIST'){
        var comments = [];
        console.log('Folder already exisits')
        Comment.fetchComments({"space_name":param})
        .then((resolve,reject)=>{
          fs.readdir(__dirname+`/test-${param}`,(err,files)=>{
            console.log('print resolve');
            console.log(resolve.comments);
            res.render(__dirname + '/pages/index',{files:files,comments:resolve.comments.reverse()});
          })
        }).catch((err)=>{
          console.log(err);
        })

      }
    }
    else{
      console.log('else block');
      Comment.addSpace({"space_name":param})
      .then((resolve,reject)=>{
        res.render(__dirname + '/pages/index',{files:[],comments:[]});
      })

    }

  });

});

app.post('/upload', function(req, res){

console.log('in upload');
  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;
  // store all uploads in the /uploads directory
  form.uploadDir = __dirname+ '/test-pro';

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

io.on('connection', function(socket){
  //console.log(socket.handshake.);
  socket.on('chat message', function(msg){

    console.log(io.listenerCount('chat message'));
    //io.emit('chat message'+msg.loc, msg.val);
  });

  socket.on('file select',function(msg){
    console.log(msg);
    console.log(msg.loc);
    console.log(msg.val);
    fs.readFile(`${__dirname}/test-${msg.loc.substring(9, msg.loc.length)}/${msg.val}`,'utf8',(err,data)=>{

      if(err)
        console.log(err);
      io.emit('file select'+msg.loc, data);
    });
  });

  socket.on('presenter changed',function(msg){

      console.log('presenter changed');
      socket.broadcast.emit('presenter changed'+msg.loc, {flag:false});

  });

  socket.on('scroll event',function(msg){


      io.emit('scroll event'+msg.loc, msg);
  });


  socket.on('review comment',function(msg){
    socket.broadcast.emit('review comment'+msg.loc,msg.val);
    var rc = msg.val;
    //construct ur commnet

    // "user_name": params.user_name | 'pranav',
    // "line_number": params.line_number | 2,
    // "user_comment": params.user_comment | "this code needs commenting",

    var comm = {
        user_name: rc.user_name,
        line_number: rc.line_number,
        user_comment: rc.user_comment
    };

    var payLoad = {
      rc:comm,
      space_name:msg.loc.substring(9, msg.loc.length)
    }
    Comment.addComment(payLoad);
  });



  socket.on('chat message', function(msg){

    //console.log(io.listenerCount('chat message'));
    if(msg.val==="trigger.txt"){
      console.log('pranav');
      //console.log(`/test-${param}`);
      fs.readFile(__dirname+'/tirgger.txt','utf8',(err,data)=>{
        if(err)
          console.log(err);
        console.log(data);
        io.emit('chat message'+msg.loc, data);
      })
    }else{
      console.log('test');
      io.emit('chat message'+msg.loc, msg.val);
    }

  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});
