import Sidebar from "./components/sidebar";
import './App.css'
import Chat from "./components/chat/chat";
import { useEffect, useState } from "react";
import Settings from "./components/settings/settings";
import io from '../node_modules/socket.io/client-dist/socket.io.js';
import ListOfChats from "./components/listOfChats/listOfChats";

let socket = io();

function App() {
  const [isRegister, setRegistration] = useState(false);
  const [userData, setUserData] = useState({
    name: 'NoName',
    nick: '',
    email: '',
    password: '',
  })
  localStorage.mobile = "mobile"
  useEffect(() => {
    if (localStorage.getItem('name')) {
      setRegistration(true);
      setUserData({ name: localStorage.getItem('name'), nick: localStorage.getItem('nick'), email: localStorage.getItem('email'), password: localStorage.getItem('password') })
    }
  }, [])
  const [error, setError] = useState(false)
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
  const [chat, setChat] = useState([])
  const setUserMassege = (value) => {
    setChat([...chat, { id: Date.now(), user: userData.nick, text: value }]);
    socket.emit('newMessage', { companion: companion, text: { id: Date.now(), user: userData.nick, text: value } })
  }
  const [companion, setCompanion] = useState('');
  const [status, setStatus] = useState(false);
  const [answer, setAnswer] = useState(null);
  useEffect(() => {
    socket.on('userConection', () => {
      if (userData.nick !== '' && userData.nick) {
        socket.emit('userConection', userData.nick);
      }
    })
    socket.on('updateStatus', message => {
      setStatus(message.status);
      console.log(message.st);
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
  const setCurrentChat = (value) => {
    setId(3);
    socket.emit('chatRequest', value);
  }
  const setData = (value) => {
    setUserData(value)
  }
  const createChat = (value) => {
    console.log(value);
    socket.emit('createChat', { user1: userData.nick, user2: value });
  }
  const [id, setId] = useState(2)
  const setPageId = (pageId) => {
    setId(pageId);
  }
  const [listOfChats, setListOfChats] = useState([])
  useEffect(() => {
    socket.emit('listOfChats', userData.nick);
    socket.on('listOfChats', message => {
      setListOfChats(message);
    })
  }, [id === 1])
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
