const express = require("express");
const cookieSession = require("cookie-session");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("./models/user.model");
const LocalStrategy = require("passport-local");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

// const server = require('http').createServer(app);

let users = [];

const addUser = (username, socketId) => {
    users.push({ username, socketId })
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
}

const getUser = (username) => {
    return users.slice().reverse().find((user) => user.username === username)
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(path.join(__dirname, "../build")));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

mongoose.connect(process.env.ATLAS_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => console.log("Connected to MongoDB database")).catch(err => {
    console.log(err.message);
});

app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 100
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/api/login", require("./routes/auth/login"));
app.use("/api/register", require("./routes/auth/register"));
app.use("/api/logout", require("./routes/auth/logout"));
app.use("/api/create", require("./routes/group/create"));
app.use("/api/join", require("./routes/group/join"));
app.use("/api/leave", require("./routes/group/leave"));
app.use("/api/group", require("./routes/group/group"));
app.use("/api/entry", require("./routes/entry/entry"));
app.use("/api/user", require("./routes/user"));
app.use("/api/leaderboard", require("./routes/leaderboard"));
app.use("/api/chat", require("./routes/chat/chat"));
app.use("/api/message", require("./routes/chat/message"));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build/index.html"));
});

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: "https://connect-ukr.herokuapp.com",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

io.on("connection", (socket) => {
    console.log("a user connected.");
    //io.emit("welcome", "hello this is socket server")
    socket.on("addUser", (username) => {
        addUser(username, socket.id);
        io.emit("getUsers", users);
    })

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId)
        console.log(users)
        //console.log(user)
        if (!user) {
            return
        }
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        })
    })

    socket.on("disconnect", () => {
        console.log("a user disconnected");
        console.log(socket.id)
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
})

module.exports = app;