import React from 'react';
import './userStatus.css'

const UserStatus = ({ status }) => {
    return (
        <div className="status">
            <span className={'status__icon' + ' ' + (status ? 'color_green' : 'color_red')}></span>
            <div className='status__info'>{status ? 'online' : 'offline'}</div>
        </div>
    );
}

export default UserStatus;