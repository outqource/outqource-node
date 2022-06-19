// https://github.com/tegioz/chat/blob/master/chatServer.js

import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Events from 'events';
import Redis from 'redis';
import SocketIORedis from 'socket.io-redis';
import _ from 'lodash';

export class SocketIO {
  public io: SocketIOServer;
  public logger: Events.EventEmitter;

  constructor(server: HttpServer) {
    const io = new SocketIOServer(server);
    this.io = io;

    const logger = new Events.EventEmitter();
    this.logger = logger;

    // this.logger.on("newEvent", function (event, data) {
    //   console.log(`newEvent Event`, event, JSON.stringify(data));
    // });
  }

  init(logger: Events.EventEmitter) {
    this.io.on('connection', function (socket) {
      socket.emit('connected', 'Welcome to chat server');
      logger.emit('newEvent', 'userConnected', { socket: socket.id });
    });
  }

  sendBroadcast(text: string) {}
}

export {};
