import React from 'react';
import UserStatus from './userStatus';
import './userInfo.css'

const UserInfo = ({ status, user, iconPath }) => {
    return (
        <div className="userInfo">
            <div className="userInfo__icon">{/*<img src={iconPath} alt="" />*/}</div>
            <div className="userInfo__about">
                <div className="userInfo__name">{user}</div>
                <UserStatus status={status} />
            </div>
        </div>
    );
}

export default UserInfo;