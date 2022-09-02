import React from 'react';
import UserInfo from '../global/userInfo';
import Input from '../input_field/input';
import './listOfChats.css'

const listOfChats = ({ findUser, chats }) => {
    console.log(chats);
    return (
        <div className="chats">
            <div className="input__description">To start a new chat, write a user's nick below</div>
            <Input setUserMassege={findUser} buttonText='start'></Input>
            <div className="chats__list list">
                {chats.map(elem => {
                    return <UserInfo key={elem.id} user={elem.toUser} status={elem.status === 1 ? true : false} />
                })}
            </div>
        </div>
    );
}

export default listOfChats;