import React from "react";
import './style.css'

const Sidebar = ({ user, iconPath, setPageId }) => {
    return (
        <aside>
            <div className="aside__header">
                <div className="aside__icon">{/*<img src={iconPath} alt="user_img" />*/}</div>
                <div className="aside__info">
                    <div className="aside__name">{user}</div>
                </div>
            </div>
            <div className="aside__main main">
                <div className="main__item"><button onClick={() => setPageId(1)}>Chats</button></div>
                <div className="main__item"><button onClick={() => setPageId(2)}>Settings</button></div>
                <div className="main__info">Messanger uses cookies files</div>
            </div>
        </aside>
    )
}

export default Sidebar;