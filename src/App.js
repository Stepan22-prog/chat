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
          console.log(res);
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
  const [chatUser, setChatUser] = useState([])
  const setUserMassege = (value) => {
    setChat([...chat, { id: Date.now(), user: 2, text: value }]);
    socket.emit('newMessage', { id: Date.now(), user: userData.nick, text: value })
  }
  const setCurrentChat = (value) => {
    setId(3);
    socket.emit('chatRequest', value);
  }
  const [companion, setCompanion] = useState('');
  const [status, setStatus] = useState(false)
  useEffect(() => {
    socket.on('responseChat', message => {
      console.log(message);
      if (message[0].user1 === userData.nick) {
        setCompanion(message[0].user2);
        if (message[0].text1 !== null) {
          for (const elem of message[0].text1) {
            elem.user = 1
          }
        }
        setChat(message[0].text1 ?? '');
        if (message[0].text2 !== null) {
          for (const elem of message[0].text2) {
            elem.user = 2
          }
        }
        setChatUser(message[0].text2 ?? '');
        setStatus(message[0].status2 === 0 ? false : true);
      } else {
        setCompanion(message[0].user1);
        if (message[0].text2 !== null) {
          for (const elem of message[0].text2) {
            elem.user = 2
          }
        }
        setChat(message[0].text2 ?? '');
        if (message[0].text1 !== null) {
          for (const elem of message[0].text1) {
            elem.user = 1
          }
        }
        setChatUser(message[0].text1 ?? '');
        setStatus(message[0].status1 === 0 ? false : true);
      }
    })
  }, [id === 3])
  const setData = (value) => {
    setUserData(value)
  }
  const [id, setId] = useState(2)
  const setPageId = (pageId) => {
    setId(pageId);
  }
  const [listOfChats, setListOfChats] = useState([])
  useEffect(() => {
    // let socket = io()

    // socket.emit('chat', [userData.nick, 'Stepan12345'],);
    // socket.on('chatUser1', (message) => {
    //   console.log('Message from server: ', message)
    //   setChat([...chat, ...message])
    // })
    // socket.emit('chatCompanion', 'Stepan12345');
    // socket.on('chatCompanion', (message) => {
    //   console.log('Message from server: ', message)
    //   setChatUser([...chatUser, ...message])
    // })
    socket.emit('listOfChats', userData.nick);
    socket.on('listOfChats', message => {
      setListOfChats(message)
    })
  }, [id === 1])
  return (
    <div className="App">
      <Sidebar user={userData.name} /*iconPath='./img/noImg.png'*/ setPageId={setPageId} />
      {id === 3 ? <Chat status={status} setUserMassege={setUserMassege} user={companion} chat={[...chat, ...chatUser]} /*iconPath='./img/noImg.png'*/ /> : null}
      {id === 1 ? <ListOfChats chats={listOfChats} setCurrentChat={setCurrentChat} /> : null}
      {id === 2 ? <Settings isRegister={isRegister} userName={userData.name} userNick={userData.nick} userEmail={userData.email} userPassword={userData.password} serverError={error} setData={setData} /> : null}
    </div>
  );
}
export default App;
