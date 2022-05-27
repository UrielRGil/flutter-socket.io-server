
const express = require('express');
require('dotenv').config();
const path = require('path');

const app = express();

//Node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);

require('./sockets/socket');
//Path publico
const publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

server.listen(process.env.PORT, (error) => {
    if (error) throw new Error(error);

    console.log('Servidor escuchando en el puerto: ', process.env.PORT);
});