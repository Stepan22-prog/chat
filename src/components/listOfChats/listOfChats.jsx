import React from 'react';
import UserInfo from '../global/userInfo';
import Input from '../input_field/input';
import './listOfChats.css'

const listOfChats = ({ createChat, chats, setCurrentChat, user, answer }) => {
    return (
        <div className="chats">
            <div className="input__description">To start a new chat, write a user's nick below</div>
            <Input setUserMassege={createChat} buttonText='start'></Input>
            <div className="answer__field">{answer}</div>
            <div className="chats__list list">
                {chats.map(elem => {
                    let status = elem.user1 === user ? elem.status2 : elem.status1;
                    return <button id={elem.id} key={elem.id} onClick={event => setCurrentChat(event.currentTarget.id)}><UserInfo user={elem.user1 === user ? elem.user2 : elem.user1} status={status === 1 ? true : false} /></button>
                })}
            </div>
        </div>
    );
}

export default listOfChats;