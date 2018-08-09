const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}


const myEmitter = new MyEmitter();

myEmitter.on('newListener',()=>console.log("someone added "));
myEmitter.on('event', () => {
  console.log('an event occurred!');
});


myEmitter.once('game_on',(a,b)=> console.log(a+b));
myEmitter.emit('event');


myEmitter.emit('game_on',4,5);
myEmitter.emit('game_on',4,5);
