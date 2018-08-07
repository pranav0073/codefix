var app = require('express')();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var process = require('process');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/test', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/test/*', function(req, res){
  //create a folder

  var param = req.url.substring(6, req.url.length);
  console.log(param);
  process.umask = 0;
  fs.mkdir(__dirname+`/test-${param}`,0777,(err)=>{
    if(err)
      if(err.code === 'EEXIST'){
        fs.readdir(__dirname+`/test-${param}`,'utf8',(err,files)=>{
          console.log(files);
        });
      }
  });
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    
    console.log(io.listenerCount('chat message'));
    //io.emit('chat message'+msg.loc, msg.val);
  });

  socket.on('chat message', function(msg){
    console.log(msg);

    console.log(msg.val);
    console.log(io.listenerCount('chat message'));
    if(msg.val==="trigger.txt"){
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
