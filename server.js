const express = require('express');
const app = express();
const server = require('http').createServer(app);
const envResult = require('dotenv').config(); 
const connectDb = require('./src/config/db');
const sockets = require('./src/routes/sockets');

server.listen(process.env.PORT);
console.log("Server runnig on port: " + process.env.PORT);

app.use(express.urlencoded({
    extended: true
}))

sockets.init(server);

module.exports = server;
