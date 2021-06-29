const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const user_credentials = require('./routes/user_credentials');
const payments = require('./routes/payments');

const app = express();

var port = normalizePort(process.env.PORT || "8000");

var server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use('/uploads', express.static('uploads'));
app.use('/', express.static('html'));
app.use('/assets', express.static('assets'));
app.use('/user_credentials', user_credentials);
app.use('/payments', payments);

mongoose.connect(
  "mongodb+srv://admin:admin@ewallet-cluster.fsj62.mongodb.net/e-wallet-database?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
}
