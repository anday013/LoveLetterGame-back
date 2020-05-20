const express = require('express');
const app = express();
const server = require('http').createServer(app);
const envResult = require('dotenv').config();
const sockets = require('./src/routes/sockets');
const apiRoutes = require('./src/routes/api/');
const connectDB = require('./config/db');
const bodyParser = require('body-parser')

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({
    extended: false
}));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    }));


server.listen(process.env.PORT);
console.log("Server runnig on port: " + process.env.PORT);

app.use(express.urlencoded({
    extended: true
}))
// Define Routes
app.use('/api/auth', require('./src/routes/api/auth'));
// app.use(express.static(__dirname + '/../Front'));
app.use('/', apiRoutes);


sockets.init(server);

module.exports = server;
