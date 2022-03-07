// local socketio.js module
import socketio from "socket.io";
// const socketio = require("socket.io");
let io;
const mysio = {
  // io: null,
  init: function (server) {
    console.log("calling init");
    io = socketio(server);
    return io;
  },

  getIO: function () {
    if (!io) {
      throw new Error("Can't get io instance before calling .init()");
    }
    return io;
  },
};

export default mysio;
