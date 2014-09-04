// socket.io specific code
console.log('aja');
var socket = io.connect();

socket.on('connect', function() {
  console.log('connected to the server ...');
});

socket.on('user', function(msg) {
  $('#user').html('User ' + msg);
});
socket.on('nusers', function(nusers) {
  $('#nusers').html('Number of users: ' + nusers);
}); 