const io = require("socket.io")(4000, {
    cors: {
        origin: "http://localhost:3000"
    },
});

let users = [];

const addUser = (username, socketId) => {
    !users.some((user) => user.username === username) &&
        users.push({ username, socketId })
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
}

const getUser = (username) => {
    return users.find((user) => user.username === username)
}

io.on("connection", (socket) => {
    console.log("a user connected.");
    //io.emit("welcome", "hello this is socket server")
    socket.on("addUser", (username) => {
        addUser(username, socket.id);
        io.emit("getUsers", users);
    })

    socket.on("sendMessage", ({ senderId, receiverId, text}) => {
        const user = getUser(receiverId)
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        })
    })

    socket.on("disconnect", () => {
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
})