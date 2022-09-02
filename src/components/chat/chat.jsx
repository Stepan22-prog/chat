import React, { useEffect, useState } from 'react';
import UserInfo from '../global/userInfo';
import './chat.css'
import Input from '../input_field/input';

const Chat = ({ chat, setUserMassege, ...props }) => {
    console.log(chat);
    chat.sort((a, b) => a.id - b.id)
    return (
        <div className="chat">
            <UserInfo {...props} />
            <div className="chat__field field">
                {chat.map(massege => {
                    return (massege.user === 1
                        ? <div key={massege.id} className="field__massege side_left"><span className='field__text'>{massege.text}</span></div>
                        : <div key={massege.id} className="field__massege side_right"><span className='field__text'>{massege.text}</span></div>
                    )
                })}
            </div>
            <Input setUserMassege={setUserMassege} buttonText='send' />
        </div>
    );
}

export default Chat;