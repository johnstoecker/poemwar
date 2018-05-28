var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const GAME_ID_LENGTH = 4;
const GAME_ID_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const STATE = {
  CREATED: 0,
  WAITING: 1,
  LIVE: 2,
  VOTING: 3,
  FINISHED: 4
}

// stores all current games (with a timeout)
var currentGames = {};
// stores all the sockets
var clients = {};


checkForStart = function(gameId) {
  // if 2 players + starting line, goggogo!
}


app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
  console.log('a user connected');
  clients[socket.id] = socket;
  socket.on('create game', function(msg){
    console.log('create game');
    var str = "";
    for(var i = 0; i < GAME_ID_LENGTH; ++i){
         str += GAME_ID_CHARS[(Math.floor(Math.random()*GAME_ID_CHARS.length))];
    }
    currentGames[str] = { id: str, state: STATE.CREATED, creator_socket: socket.id, player_sockets: [], poems: {} }
    socket.emit('game created', str, { for: 'everyone' });

    // drop the game in 25 minutes
    setTimeout(function() { currentGames[str] = {};}, 1500000)
    console.log('message: ' + msg);
  });

  socket.on('join game', function(gameId){
    console.log('join game');
    if (currentGames[gameId]){
      currentGames[gameId].player_sockets.push(socket.id)
      socket.emit('game joined', currentGames[gameId])
    }
  })

  // form of: { game_id: 'xxx', poem: 'Once upon a midnight dreary....'}
  socket.on('poem submit', function(data){
    console.log('submit poem');
    console.log(data)
    if (currentGames[data.id]){
      currentGames[data.id].poems[socket.id] = data.poem
      console.log(currentGames[data.id].creator_socket)
      clients[currentGames[data.id].creator_socket].emit('poem submit', currentGames[data.id])
    }
  })

  socket.on('poem start', function(data){
    console.log('poem start');
    console.log(data);
    currentGames[data.id].start = data.line;
    currentGames[data.id].state = STATE.WAITING;
    // TODO:
    // checkForStart(data.game_id);
    console.log(currentGames)
  })
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
