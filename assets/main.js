$(document).ready(function() {


var socket = io.connect('http://localhost:3000');

var gameState = {}

socket.on('game created', function(gameId){
      $('#createGameId').html(gameId);
      console.log(gameId)
      // TODO: allow user to reload + grab from local storage
      window.localStorage.currentGameId = gameId
      gameState.id = gameId;
});

socket.on('game joined', function(gameData){
  console.log(gameData)
  if (gameData && gameData.id) {
    $('#joinGameId').html(gameData.id)
    gameState = gameData
    if (gameData.start) {
      $('#startingLine').html(gameData.start)
    }
  }
})

socket.on('poem submit', function(gameData){
  console.log('poem submitted')
  console.log(gameData)
})

socket.emit('create game', "asdf");

$('#joinGameForm').submit(function(){
    console.log('button clicked');
    socket.emit('join game', $('#joinGame').val());
    return false;
});

$('#poemStartForm').submit(function(){
    console.log('button clicked');

    socket.emit('poem start', { id: gameState.id, line: $('#poemStart').val() });
    return false;
});

$('#poemSubmitForm').submit(function(){
    console.log('button clicked');
    console.log(gameState)
    socket.emit('poem submit', { id: gameState.id, line: $('#poemSubmit').val() });
    return false;
});

closeVideos = function() {
  $("#content").css("display", "inherit")
  $("#thronesy_player").css("display", "none");
  $("#wavesaw_player").css("display", "none");
  $(".video_player").each(function(){
    this.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*')
  });
}

openVideo = function(id) {
  $("#video_iframe").css("display", "flex");
  closeVideos();
  $("#content").css("display", "none")
  $("#"+id).css("display", "inherit")
}

$("#stoecker_tile").click(function() {
})

$("#thronesy_tile").click(function() {
  openVideo("thronesy_player");
  //$("#thronesy_iframe").css("display", "flex");
  //openVideo("https://www.youtube.com/embed/ZSJR-8v3RpU?list=PLugc43BMDjg-YMGXDES2FWA5YbGCUk4E-");
})
})
