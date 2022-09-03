import React from 'react';
import UserInfo from '../global/userInfo';
import Input from '../input_field/input';
import './listOfChats.css'

const listOfChats = ({ findUser, chats, setCurrentChat }) => {
    console.log(chats);
    return (
        <div className="chats">
            <div className="input__description">To start a new chat, write a user's nick below</div>
            <Input setUserMassege={findUser} buttonText='start'></Input>
            <div className="chats__list list">
                {chats.map(elem => {
                    return <button id={elem.id} key={elem.id} onClick={event => setCurrentChat(event.currentTarget.id)}><UserInfo onClick={console.log('ok')} user={elem.user2} status={elem.status2 === 1 ? true : false} /></button>
                })}
            </div>
        </div>
    );
}

export default listOfChats;