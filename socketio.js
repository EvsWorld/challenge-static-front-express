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

// wip
const SocketClass = (server, Param1) =>
  class MyClass {
    constructor(server) {
      this.io;
      this.server = server;
      console.log(Param1);
    }
    init(server) {
      console.log("calling init");
      this.io = socketio(server);
      return this.io;
    }

    getIO() {
      if (!this.io) {
        throw new Error("Can't get io instance before calling .init()");
      }
      return this.io;
    }
  };
