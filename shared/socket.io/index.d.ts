/// <reference types="node" />
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import Events from "events";
export declare class SocketIO {
    io: SocketIOServer;
    logger: Events.EventEmitter;
    constructor(server: HttpServer);
    init(logger: Events.EventEmitter): void;
    sendBroadcast(text: string): void;
}
export {};
