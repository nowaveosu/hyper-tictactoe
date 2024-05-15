

const io = require("socket.io")(3000, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
    },
});

let rooms = {};

io.on("connection", (socket) => {
    console.log("A user connected.");

    socket.on("joinRoom", (roomName) => {    
        console.log("joining room: " + roomName);
        socket.join(roomName);       
        if (!rooms[roomName]) {      
            rooms[roomName] = {
                players: [],
                board: Array(144).fill(null), 
                turn: 0,
                rsp: [], 
                rspResult: null, 
            };
        }
        rooms[roomName].players.push(socket.id);  
        io.to(roomName).emit("gameState", rooms[roomName]);  
    });

    socket.on("message", (message, roomName) => {
        console.log("sending message", message, roomName);
        if (roomName.length) {
            io.to(roomName).emit("message", message);
        } else {
            io.emit("message", message);
        }
    });

    socket.on("makeMove", (index, roomName) => {  
        let room = rooms[roomName];
        if (room && room.players[room.turn % 2] === socket.id && room.board[index] === null && room.rspResult) { 
            room.board[index] = room.turn % 2 === 0 ? "X" : "O";   
            room.turn++;   
            io.to(roomName).emit("gameState", room);
        }
    });

    socket.on("playRSP", (choice, roomName) => { 
        let room = rooms[roomName];
        if (room) {
            room.rsp.push({ player: socket.id, choice });
            if (room.rsp.length === 2) {
                let [p1, p2] = room.rsp;
                if (p1.choice === p2.choice) {
                    room.rspResult = "Draw";
                } else if (
                    (p1.choice === "rock" && p2.choice === "scissors") ||
                    (p1.choice === "scissors" && p2.choice === "paper") ||
                    (p1.choice === "paper" && p2.choice === "rock")
                ) {
                    room.rspResult = p1.player;
                } else {
                    room.rspResult = p2.player;
                }
                room.rsp = [];
                io.to(roomName).emit("gameState", room);
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected.");
        for (let roomName in rooms) {
            let room = rooms[roomName];
            let playerIndex = room.players.indexOf(socket.id);
            if (playerIndex !== -1) {
                room.players.splice(playerIndex, 1);
                if (room.players.length === 0) {
                    delete rooms[roomName];
                } else {
                    io.to(roomName).emit("gameState", room);
                }
            }
        }
    });
});