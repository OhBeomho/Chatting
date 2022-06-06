const express = require("express")
const app = express()
const path = require("path")
const http = require("http")
const server = http.createServer(app)
const socketIO = require("socket.io")
const io = socketIO(server)
const moment = require("moment")
const PORT = process.env.PORT || 5000

let users = []

app.use(express.static(path.join(__dirname, "src")))

io.on("connection", (socket) => {
    socket.emit("s-chatting", {
        msg: "USER_LIST",
        list: users
    })

    socket.on("chatting", (data) => {
        let { username, msg } = data
        io.emit("chatting", {
            username,
            msg,
            time: moment(new Date()).format("h:ss A")
        })
    })
    socket.on("username-check", (name) => {
        if (users.includes(name)) {
            socket.emit("username-check", "EXISTS")
            return
        }

        socket.emit("username-check", "NOT_EXISTS")
        socket.username = name

        users.push(name)

        io.emit("s-chatting", {
            msg: "JOIN",
            username: name
        })
    })
    socket.on("disconnect", () => {
        if (socket.username != undefined) {
            io.emit("s-chatting", {
                msg: "LEAVE",
                username: socket.username
            })
        }

        users = users.filter((username) => username !== socket.username)
    })
})

server.listen(PORT, () => {
    console.log("The server is running on localhost:" + PORT)
})