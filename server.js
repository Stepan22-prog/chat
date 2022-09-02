const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const { Server } = require('socket.io');

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
    socket.on('listOfChats', message => {
        baseConect('SELECT * FROM `chats` WHERE `fromUser`= ? || `toUser`= ?', undefined, sendList, [message, message], [socket])
    })
    socket.on('chat', message => {
        baseConect('SELECT * FROM `chats` WHERE `fromUser`= ? && `toUser`= ?', undefined, sendChat, message, [socket, 1]);
    })
    socket.on('chatCompanion', message => {
        baseConect('SELECT * FROM `chats` WHERE `fromUser`= ? && `toUser`= ?', undefined, sendChat, message, [socket, 2]);
    })
    socket.on('newMessage', message => {
        console.log(message);

    })
    socket.on('disconnect', () => {
        console.log(`Client with id ${socket.id} disconnected`)
    })
});

const sendChat = (result, res, socket, user) => {
    let message = Object.values(result[0].chat)[0]
    Object.values(result[0].chat)[0].map(element => element['user'] = user === 1 ? 1 : 2)
    socket.emit(user === 1 ? 'chatUser1' : 'chatCompanion', message);
}

const sendList = (result, res, socket) => {
    let message = result.filter((item, pos) => {
        if (result[pos + 1]) {
            return item.toUser !== result[pos].fromUser
        }
    });
    socket.emit('listOfChats', message)
}