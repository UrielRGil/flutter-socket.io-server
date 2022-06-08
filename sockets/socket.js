const { Socket } = require('socket.io');
const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');


const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Enanitos verdes'));
bands.addBand(new Band('Pink Floy'));


console.log('init server');

//Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');    
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.emit('active-bands', bands.getBands());

    client.on('mensaje', (payload) => {
        console.log('Mensaje: ', payload);
        io.emit('mensaje', {mensaje: 'Recibido'});
    });

    client.on('emitir-mensaje', (payload) => {
        console.log('Nuevo mensaje');
        console.log(payload);
        //client.emit('nuevo-mensaje', payload); //Emite a todos los clientes
        client.broadcast.emit('nuevo-mensaje', payload); //Emite a todos los clientes menos al que lo envio
    });

    client.on('votar-banda', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        
        bands = bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
});
