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
                board: Array(16).fill(null), 
                turn: 0,
                rps: [], 
                rpsResult: null, 
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
        if (room && room.players[room.turn % 2] === socket.id && room.board[index] === null && room.rpsResult) { 
            room.board[index] = room.turn % 2 === 0 ? "X" : "O";   
            room.turn++;   
            io.to(roomName).emit("gameState", room);
        }
    });

    socket.on("playRPS", (choice, roomName) => { 
        let room = rooms[roomName];
        if (room) {
            room.rps.push({ player: socket.id, choice });
            if (room.rps.length === 2) {
                let [p1, p2] = room.rps;
                if (p1.choice === p2.choice) {
                    room.rpsResult = "Draw";
                } else if (
                    (p1.choice === "rock" && p2.choice === "scissors") ||
                    (p1.choice === "scissors" && p2.choice === "paper") ||
                    (p1.choice === "paper" && p2.choice === "rock")
                ) {
                    room.rpsResult = p1.player;
                    room.players = [p1.player, p2.player]; 
                } else {
                    room.rpsResult = p2.player;
                    room.players = [p2.player, p1.player]; 
                }
                room.rps = [];
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
