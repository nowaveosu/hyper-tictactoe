const io = require("socket.io")(3001,{
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
},
});

io.on("connection",(socket) => {
    console.log("A user connected.")
    socket.on("message",(message, roomName) => {
        console.log(message, roomName)
    })
})

console.log("hello world")