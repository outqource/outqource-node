'use strict';
// https://github.com/tegioz/chat/blob/master/chatServer.js
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.SocketIO = void 0;
const socket_io_1 = require('socket.io');
const events_1 = __importDefault(require('events'));
class SocketIO {
  constructor(server) {
    const io = new socket_io_1.Server(server);
    this.io = io;
    const logger = new events_1.default.EventEmitter();
    this.logger = logger;
  }
  init(logger) {
    this.io.on('connection', function (socket) {
      socket.emit('connected', 'Welcome to chat server');
      logger.emit('newEvent', 'userConnected', { socket: socket.id });
    });
  }
  sendBroadcast(text) {}
}
exports.SocketIO = SocketIO;
