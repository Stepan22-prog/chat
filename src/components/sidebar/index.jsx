import React from "react";
import { useState } from "react";
import { CSSTransition } from 'react-transition-group';
import './style.css'

const Sidebar = ({ user, iconPath, setPageId }) => {
    const [inProp, setInProp] = useState(false);
    return (
        <CSSTransition in={inProp} timeout={{
            enter: 0,
            exit: 300,
        }} classNames="aside">
            <aside className="aside">
                <div className="aside__header">
                    <div className="aside__burger" onClick={() => inProp ? setInProp(false) : setInProp(true)}>
                        <span className="aside-burger__span"></span>
                    </div>
                    <div className="aside__icon">{/*<img src={iconPath} alt="user_img" />*/}</div>
                    <div className="aside__info">
                        <div className="aside__name">{user}</div>
                    </div>
                </div>
                <div className="aside__main main">
                    <div className="main__item" onClick={() => setPageId(1)}><span className="material-symbols-outlined">chat</span><span className="main-item__text">Chats</span></div>
                    <div className="main__item" onClick={() => setPageId(2)}><span className="material-symbols-outlined">settings</span><span className="main-item__text">Settings</span></div>
                    <div className="main__info">Messanger uses localstorage</div>
                </div>
            </aside>
        </CSSTransition>
    )
}

export default Sidebar;