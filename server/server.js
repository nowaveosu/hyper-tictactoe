const io = require("socket.io")(3000,{
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
},
});

let rooms = {};

io.on("connection",(socket) => {
    console.log("A user connected.")

    socket.on("joinRoom", (roomName) => {
        console.log("joining room : " + roomName);
        socket.join(roomName);
        if (!rooms[roomName]) {
            rooms[roomName] = {
                players: [],
                board: Array(9).fill(null),
                turn: 0,
            }
        }
        rooms[roomName].players.push(socket.id);
        io.to(roomName).emit("gameState", rooms[roomName]);
    })

    socket.on("message",(message, roomName) => {
    console.log("sending message", message, roomName)
        if(roomName.length){
            io.to(roomName).emit("message", message)
        } else {
            io.emit("message",message)
        }
        
    })
    socket.on("disconnect", () => {
        console.log("user disconnected.")
    })

})
