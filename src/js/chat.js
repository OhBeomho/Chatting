"use strict"

const socket = io()
let myName, users = []

const messageInput = document.querySelector(".message-input"),
    nameInput = document.querySelector(".username"),
    messageList = document.querySelector(".messages"),
    userList = document.querySelector(".users")

socket.on("username-check", (msg) => {
    if (msg == "EXISTS") {
        alert("이미 존재하는 이름입니다.\n다른 이름을 입력해 주세요.")
    } else {
        document.querySelector(".name-input").style.maxHeight = "0px"

        myName = nameInput.value
        users.push(myName)
        nameInput.value = ""

        socket.on("chatting", (data) => {
            let { msg, username, time } = data
            const message = new MessageLi(msg, username, time)
            message.make()

            let middleDiv = document.querySelector(".middle")
            middleDiv.scrollTo(0, middleDiv.scrollHeight)
        })
    }
})

socket.on("s-chatting", (data) => {
    if (data.msg == "JOIN") {
        serverMessage(data.username + "님이 들어왔습니다.")
        users.push(data.name)
    } else if (data.msg == "LEAVE") {
        serverMessage(data.username + "님이 나갔습니다.")
        users = users.filter((username) => username != data.username)
    } else if (data.msg == "USER_LIST") {
        users = data.list
    }
})

// Message li
function MessageLi(msg, username, time) {
    this.msg = msg
    this.username = username
    this.time = time
    this.make = () => {
        const li = document.createElement("li")
        li.classList.add(username == myName ? "me" : "other")
        const dom = `
            <div class="user">
                <span class="img">
                    <img src="http://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png" alt="">
                </span><br>
                <span class="username">${username}</span>
            </div>
            <span class="message">
                ${msg}
            </span>
        `
        li.innerHTML = dom
        messageList.appendChild(li)
    }
}

function serverMessage(msg) {
    const li = document.createElement("li")
    li.innerText = msg
    li.classList.add("server")
    messageList.appendChild(li)
}

document.querySelector(".enter-chatting").addEventListener("click", () => {
    if (nameInput.value != "") {
        socket.emit("username-check", nameInput.value)
    }
})

messageInput.addEventListener("keypress", (e) => {
    if (e.keyCode == 13 && messageInput.value != "") {
        send()
    }
})

document.querySelector(".send").addEventListener("click", () => {
    if (messageInput.value != "") {
        send()
    }
})

function send() {
    let message = {
        username: myName,
        msg: messageInput.value
    }

    socket.emit("chatting", message)
    messageInput.value = ""
}