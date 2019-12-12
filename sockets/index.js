io = require("socket.io")();

io.on("connection", socket => {
  socket.on("entered", data => {
    io.emit("entry msg", data)
  })
});

module.exports = io;
