var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('Alguien se ha conectado con Sockets');
    //socket.emit('messages', messages);
    socket.on('subscribe', function(data) {
        deck_id = data.deck_id;
        publisher = data.options.publisher;
    });

    setTimeout(function () {
        io.sockets.emit('connect');
    }, 100);

    setTimeout(function () {
        io.sockets.emit('message', {"indexh":1,"indexv":0,"paused":false,"overview":false,"publisher_id":"1472596923459-75033"});
    }, 1000);

});

server.listen(8080, function() {
    console.log("Servidor corriendo en http://localhost:8080");
});