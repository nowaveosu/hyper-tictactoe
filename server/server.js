const io = require("socket.io")(3000,{
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
},
});

io.on("connection",(socket) => {
    console.log("A user connected.")
    socket.on("message",(message, roomName) => {
        io.emit("message",message)
    })
})

console.log("hello world")