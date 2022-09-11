import Sidebar from "./components/sidebar";
import './App.css'
import Chat from "./components/chat/chat";
import { useEffect, useState } from "react";
import Settings from "./components/settings/settings";
import io from '../node_modules/socket.io/client-dist/socket.io.js';
import ListOfChats from "./components/listOfChats/listOfChats";

let socket = io();
localStorage.mobile = "mobile";

function App() {
  const [isRegister, setRegistration] = useState(false);
  const [userData, setUserData] = useState({
    name: 'NoName',
    nick: '',
    email: '',
    password: '',
  });
  const [chat, setChat] = useState([{
    "id": 12345,
    "text": "Hello",
    "user": "Stepan12345"
  },
  {
    "id": 12346,
    "text": "It`s creator of this app",
    "user": "Stepan12345"
  },
  {
    "id": 12347,
    "text": "You can ask me a question",
    "user": "Stepan12345"
  },
  {
    "id": 43534,
    "text": "Hello world",
    "user": "spicy"
  },
  {
    "id": 1662278454097,
    "text": "I have",
    "user": "spicy"
  },
  {
    "id": 1662280345252,
    "text": "Ddfcfcc",
    "user": "Stepan12345"
  },
  {
    "id": 1662303366247,
    "text": "It's me",
    "user": "Stepan12345"
  },
  {
    "id": 1662453777416,
    "text": "last mess",
    "user": "spicy"
  },
  {
    "id": 1662456893660,
    "text": "test",
    "user": "spicy"
  },
  {
    "id": 1662456969255,
    "text": "fgfg",
    "user": "spicy"
  },
  {
    "id": 1662458241960,
    "text": "qwerty",
    "user": "spicy"
  },
  {
    "id": 1662477324118,
    "text": "How",
    "user": "Stepan12345"
  },
  {
    "id": 1662477332835,
    "text": "nice",
    "user": "spicy"
  },
  {
    "id": 1662479366343,
    "text": "fail2",
    "user": "spicy"
  },
  {
    "id": 1662632185849,
    "text": "Норм",
    "user": "Stepan12345"
  },
  {
    "id": 12345,
    "text": "Hello",
    "user": "Stepan12345"
  },
  {
    "id": 12346,
    "text": "It`s creator of this app",
    "user": "Stepan12345"
  },
  {
    "id": 12347,
    "text": "You can ask me a question",
    "user": "Stepan12345"
  },
  {
    "id": 43534,
    "text": "Hello world",
    "user": "spicy"
  },
  {
    "id": 1662278454097,
    "text": "I have",
    "user": "spicy"
  },
  {
    "id": 1662280345252,
    "text": "Ddfcfcc",
    "user": "Stepan12345"
  },
  {
    "id": 1662303366247,
    "text": "It's me",
    "user": "Stepan12345"
  },
  {
    "id": 1662453777416,
    "text": "last mess",
    "user": "spicy"
  },
  {
    "id": 1662456893660,
    "text": "test",
    "user": "spicy"
  },
  {
    "id": 1662456969255,
    "text": "fgfg",
    "user": "spicy"
  },
  {
    "id": 1662458241960,
    "text": "qwerty",
    "user": "spicy"
  },
  {
    "id": 1662477324118,
    "text": "How",
    "user": "Stepan12345"
  },
  {
    "id": 1662477332835,
    "text": "nice",
    "user": "spicy"
  },
  {
    "id": 1662479366343,
    "text": "fail2",
    "user": "spicy"
  },
  {
    "id": 1662632185849,
    "text": "Норм",
    "user": "Stepan12345"
  }]);
  const [companion, setCompanion] = useState('');
  const [status, setStatus] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState(false);
  const [id, setId] = useState(3);
  const [listOfChats, setListOfChats] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('name')) {
      setRegistration(true);
      setUserData({ name: localStorage.getItem('name'), nick: localStorage.getItem('nick'), email: localStorage.getItem('email'), password: localStorage.getItem('password') })
    }
  }, []);
  useEffect(() => {
    if (userData.name !== 'NoName') {
      fetch('/userData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "name": userData.name,
          "nick": userData.nick,
          "email": userData.email,
          "password": userData.password,
        })
      })
        .then(res => res.text())
        .then(res => {
          res === 'error' ? setError(true) : setError(false);
          if (res !== 'error' && localStorage.length !== 0) {
            localStorage.setItem('name', userData.name);
            localStorage.setItem('nick', userData.nick);
            localStorage.setItem('email', userData.email);
            localStorage.setItem('password', userData.password);
          }
        })
    }
  }, [userData])
  useEffect(() => {
    socket.emit('listOfChats', userData.nick);
    socket.on('listOfChats', message => {
      setListOfChats(message);
    })
  }, [id])
  useEffect(() => {
    socket.on('userConection', () => {
      if (userData.nick !== '' && userData.nick) {
        socket.emit('userConection', userData.nick);
      }
    })
    socket.on('updateStatus', message => {
      setStatus(message.status);
    })
    socket.on('newMessage', message => {
      if (chat.length !== 0) {
        setChat([...chat, message]);
      }
    })
    socket.on('responseChat', message => {
      setChat(message[0].text);
      if (message[0].user1 === userData.nick) {
        setCompanion(message[0].user2);
        message[0].status2 === 0 ? setStatus(false) : setStatus(true);
      } else {
        setCompanion(message[0].user1);
        message[0].status1 === 0 ? setStatus(false) : setStatus(true);
      }
      const chatField = document.querySelector('.chat__field');
      chatField.scrollTo(0, chatField.clientHeight);
    })
    socket.on('createUser', message => {
      if (listOfChats.length !== 0) {
        if (message.error) {
          setAnswer(message.text)
        } else {
          setListOfChats([...listOfChats, message.text]);
          setAnswer('The user was found');
        }
      }
    })
  })

  const setUserMassege = (value) => {
    setChat([...chat, { id: Date.now(), user: userData.nick, text: value }]);
    socket.emit('newMessage', { companion: companion, text: { id: Date.now(), user: userData.nick, text: value } })
  }
  const setCurrentChat = (value) => {
    setId(3);
    socket.emit('chatRequest', value);
    console.log(value);
  }
  const setData = (value) => {
    setUserData(value)
  }
  const createChat = (value) => {
    console.log(value);
    socket.emit('createChat', { user1: userData.nick, user2: value });
  }
  const setPageId = (pageId) => {
    setId(pageId);
  }

  return (
    <div className="App">
      <Sidebar user={userData.name} /*iconPath='./img/noImg.png'*/ setPageId={setPageId} />
      {id === 3 ? <Chat status={status} setUserMassege={setUserMassege} user={companion} chat={chat} /*iconPath='./img/noImg.png'*/ /> : null}
      {id === 1 ? <ListOfChats chats={listOfChats} user={userData.nick} answer={answer} setCurrentChat={setCurrentChat} createChat={createChat} /> : null}
      {id === 2 ? <Settings isRegister={isRegister} userName={userData.name} userNick={userData.nick} userEmail={userData.email} userPassword={userData.password} serverError={error} setData={setData} /> : null}
    </div>
  );
}
export default App;
