var express = require('express');
var app = require('express')();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var process = require('process');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', function(req, res){
  res.render(__dirname + '/pages/index',{files:[]});
});

app.get('/project', function(req, res){
  res.render(__dirname + '/pages/index',{files:[]});
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
        console.log('Folder already exisits')
        fs.readdir(__dirname+`/test-${param}`,(err,files)=>{
          // console.log(err);
          // console.log(files);
          res.render(__dirname + '/pages/index',{files:files});
        })
      }
    }
    else{
      console.log('else block');
      res.render(__dirname + '/pages/index',{files:[]});
    }

  });

});

io.on('connection', function(socket){
  //console.log(socket.handshake.);
  socket.on('chat message', function(msg){

    console.log(io.listenerCount('chat message'));
    //io.emit('chat message'+msg.loc, msg.val);
  });

  socket.on('chat message', function(msg){
    console.log(msg);

    console.log(msg.val);
    console.log(io.listenerCount('chat message'));
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
