const express = require('express');
const app = express();
const server = require('http').createServer(app);
const envResult = require('dotenv').config(); 
const connectDb = require('./src/config/db');
const sockets = require('./src/routes/sockets');
const apiRoutes =  require('./src/routes/api/');

server.listen(process.env.PORT);
console.log("Server runnig on port: " + process.env.PORT);

app.use(express.urlencoded({
    extended: true
}))
// app.use(express.static(__dirname + '/../Front'));
app.use('/', apiRoutes);

sockets.init(server);

module.exports = server;
