"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const rooms = {};
const roomHandler = (socket) => {
    const createRoom = () => {
        const roomId = (0, uuid_1.v4)();
        socket.join(roomId);
        rooms[roomId] = [];
        socket.emit("room-created", { roomId });
        console.log("Room created with id", roomId);
    };
    const joinedRoom = ({ roomId, peerId }) => {
        console.log("joined room called", rooms, roomId, peerId);
        if (rooms[roomId]) {
            console.log("New user has joined room", roomId, "with peer id as", peerId);
            rooms[roomId].push(peerId);
            console.log("added peer to room", rooms);
            socket.join(roomId);
            socket.on("ready", () => {
                socket.to(roomId).emit("user-joined", { peerId });
            });
            socket.emit("get-users", {
                roomId,
                participants: rooms[roomId]
            });
        }
    };
    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);
};
exports.default = roomHandler;
