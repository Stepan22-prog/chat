const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const { Server } = require('socket.io');
const { WebSocketServer } = require('ws');
const { create } = require('domain');

//server
const httpServer = http.createServer((req, res) => {
    if (req.url === '/') {
        sendRes('index.html', 'text/html', res);
    } if (req.url === '/userData') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        })
        req.on('end', () => {
            let bodyParse = JSON.parse(body);
            baseConect('SELECT * FROM `users`', res, createOrLogIn, [], [bodyParse]);
        })
    } else {
        sendRes(req.url, getContentType(req.url), res);
    }
}).listen(process.env.PORT || 3000)

function sendRes(url, contentType, res) {
    let file = path.join(__dirname + '/build', url);
    fs.readFile(file, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.write('file not found');
            res.end();
            console.log(err);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(content);
            res.end();
        }
    })
}
function getContentType(url) {
    switch (path.extname(url)) {
        case ".html":
            return "text/html";
        case ".css":
            return "text/css";
        case ".js":
            return "text/javascript";
        case ".json":
            return "application/json";
        default:
            return "application/octet-stream";
    }
}
const responseFunc = (res, content) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(content)
}

const baseConect = (typeOfQuerry, res, someFunction, params, paramsForFunc) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'chat'
    });
    connection.query(
        typeOfQuerry, params,
        (err, result) => {
            if (err) {
                if (res) {
                    res.writeHead(404)
                    res.end()
                }
                console.log(err);
            } else if (someFunction) {
                someFunction(result, res, ...paramsForFunc)
            }
        }
    )
    connection.end()
}
//functions for database
const createOrLogIn = (result, res, bodyParse) => {
    let checkUser = result.find(element => (element.nick === bodyParse.nick && element.email === bodyParse.email && element.password === bodyParse.password))
    if (checkUser) {
        console.log('succes');
        res.writeHead(200, {
            "Content-Type": `text/plain`
        });
        res.end('succes');
    } else {
        if (result.find(element => (element.nick === bodyParse.nick || element.email === bodyParse.email || element.password === bodyParse.password))) {
            res.writeHead(200, {
                "Content-Type": 'application/json'
            })
            res.end('error')
        } else {
            res.writeHead(200, {
                "Content-Type": `text/plain`
            });
            baseConect('INSERT INTO `users`(`id`, `name`, `nick`, `email`, `password`) VALUES (?,?,?,?,?)', res, undefined, [result.length + 1, bodyParse.name, bodyParse.nick, bodyParse.email, bodyParse.password], []);
            res.end('created');
        }
        console.log('veryGood');
    }
}
//websocet
const io = new Server(httpServer, {
    // options
});

io.on("connection", (socket) => {
    console.log(`Client with id ${socket.id} connected`);
    socket.emit('userConection');
    socket.on('userConection', message => {
        baseConect('SELECT * FROM `chats2` WHERE `user1`= ? || `user2`= ?', undefined, statusOnline, [message, message], [message, socket])
    })
    socket.on('listOfChats', message => {
        baseConect('SELECT * FROM `chats2` WHERE `user1`= ? || `user2`= ?', undefined, sendList, [message, message], [socket])
    })
    socket.on('chatRequest', message => {
        baseConect('SELECT * FROM `chats2` WHERE `id`= ?', undefined, responseChat, [message], [socket])
    })
    socket.on('newMessage', message => {
        baseConect('SELECT * FROM `chats2`', undefined, newMessage, [], [message, socket])
    })
    socket.on('createChat', message => {
        baseConect('SELECT * FROM `users` WHERE `nick`=?', undefined, checkUser, [message.user2], [message, socket])
    })
    socket.on('disconnect', () => {
        console.log(`Client with id ${socket.id} disconnected`);
        baseConect('SELECT * FROM `chats2` WHERE `user1Id`= ? || `user2Id`= ?', undefined, statusOffline, [socket.id, socket.id], [socket]);
    })
});

const responseChat = (result, res, socket) => {
    socket.emit('responseChat', result);
}

const sendList = (result, res, socket) => {
    socket.emit('listOfChats', result)
}

const newMessage = (result, res, message, socket) => {
    for (const chat of result) {
        if (chat.user1 === message.companion && chat.user2 === message.text.user) {
            baseConect('UPDATE `chats2` SET `text` = ? WHERE `user1`=? && `user2`=?', undefined, undefined, [JSON.stringify([...chat.text, message.text]), message.companion, message.text.user], [])
            chat.user1Id !== null ? socket.to(chat.user1Id).emit('newMessage', message.text) : null;
            socket.to(chat.user2Id).emit('newMessage', message.text);
            console.log(chat.text);
        } else {
            chat.user2Id !== null ? socket.to(chat.user2Id).emit('newMessage', message.text) : null;
            console.log(chat.text);
            baseConect('UPDATE `chats2` SET `text` = ? WHERE `user2`=? && `user1`=?', undefined, undefined, [JSON.stringify([...chat.text, message.text]), message.companion, message.text.user], []);
        }
    }
}
const statusOnline = (result, res, message, socket) => {
    for (const chat of result) {
        if (chat.user1 === message) {
            chat.user2Id !== null ? socket.to(chat.user2Id).emit('updateStatus', { nick: chat.user1, status: true }) : null;
            baseConect('UPDATE `chats2` SET `status1` = ?, `user1Id`=? WHERE `user1`= ?', undefined, undefined, [1, socket.id, message])
        } else {
            chat.user1Id !== null ? socket.to(chat.user1Id).emit('updateStatus', { nick: chat.user2, status: true }) : null;
            baseConect('UPDATE `chats2` SET `status2` = ?, `user2Id` =? WHERE `user2`= ?', undefined, undefined, [1, socket.id, message])
        }
    }
}
const statusOffline = (result, res, socket) => {
    for (const chat of result) {
        if (chat.user1Id === socket.id) {
            chat.user2Id !== null ? socket.to(chat.user2Id).emit('updateStatus', { nick: chat.user1, status: false }) : null;
            baseConect('UPDATE `chats2` SET `status1` = ?, `user1Id`=? WHERE `user1Id`= ?', undefined, undefined, [0, null, socket.id])
        } else {
            chat.user1Id !== null ? socket.to(chat.user1Id).emit('updateStatus', { nick: chat.user2, status: false }) : null;
            baseConect('UPDATE `chats2` SET `status2` = ?, `user2Id` =? WHERE `user2Id`= ?', undefined, undefined, [0, null, socket.id])
        }
    }
}
const checkUser = (result, res, message, socket) => {
    if (result.length !== 0) {
        baseConect('SELECT * FROM `chats2` WHERE `user1`= ? && `user2`= ? || `user1`= ? && `user2`= ?', undefined, createUser, [message.user1, message.user2, message.user2, message.user1], [message, socket]);
    } else {
        socket.emit('createUser', { error: true, text: 'The user with this name does not exist' })
    }
}
const createUser = (result, res, message, socket) => {
    if (result.length == 0) {
        baseConect('INSERT INTO `chats2`(`id`, `user1`, `status1`, `user1Id`, `user2`, `status2`, `user2Id`, `text`) VALUES (?,?,?,?,?,?,?,?)', undefined, undefined, [Date.now(), message.user1, 1, socket.id, message.user2, 0, null, JSON.stringify([])], []);
        socket.emit('createUser', { error: false, text: { id: Date.now(), user1: message.user2, status: 0 } })
    } else {
        socket.emit('createUser', { error: true, text: 'You already have a chat with this user' })
    }
}