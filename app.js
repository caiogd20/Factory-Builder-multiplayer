var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.js
const { Server } = require('socket.io');
const configurarJogo = require('./games'); // Importa o seu arquivo games.js

app.setupSocket = function (server) {
    const io = new Server(server);

    // Passa a instância do io para o games.js
    configurarJogo(io);

    return io;
};


module.exports = app;
