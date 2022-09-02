import Sidebar from "./components/sidebar";
import './App.css'
import Chat from "./components/chat/chat";
import { useEffect, useState } from "react";
import Settings from "./components/settings/settings";
import io from '../node_modules/socket.io/client-dist/socket.io.js';
import ListOfChats from "./components/listOfChats/listOfChats";


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
    //let socket = io()
    //socket.emit('newMessage', { id: Date.now(), user: userData.nick, text: value })
  }
  const setData = (value) => {
    setUserData(value)
  }
  const [id, setId] = useState(2)
  const setPageId = (pageId) => {
    setId(pageId);
  }
  const [listOfChats, setListOfChats] = useState([])
  useEffect(() => {
    if (id === 1) {
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
      let socket = io();
      socket.emit('listOfChats', userData.nick);
      socket.on('listOfChats', message => {
        console.log(message);
        setListOfChats(message)
      })
    }
  }, [id])
  return (
    <div className="App">
      <Sidebar user={userData.name} /*iconPath='./img/noImg.png'*/ setPageId={setPageId} />
      {/*id === 1 ? <Chat status={true} setUserMassege={setUserMassege} user='Admin' chat={[...chat, ...chatUser]} /*iconPath='./img/noImg.png'*/ /*/> : null*/}
      {id === 1 ? <ListOfChats chats={listOfChats} /> : null}
      {id === 2 ? <Settings isRegister={isRegister} userName={userData.name} userNick={userData.nick} userEmail={userData.email} userPassword={userData.password} serverError={error} setData={setData} /> : null}
    </div>
  );
}
export default App;
