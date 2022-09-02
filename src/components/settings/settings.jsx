import React, { useEffect, useState } from 'react';
import './settings.css'

const Settings = ({ isRegister, userName, userNick, userEmail, setData, serverError }) => {
    const [name, setName] = useState('');
    const [nick, setNick] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    useEffect(() => {
        serverError ? setError(true) : setError(false);
    }, [serverError])
    const onButton = (event) => {
        event.preventDefault()
        if (name.trim() && nick.trim() && email.trim() && password.trim()) {
            setData({
                name: name.trim(),
                nick: nick.trim(),
                email: email.trim(),
                password: password.trim(),
            })
            setName('');
            setNick('');
            setEmail('');
            setPassword('');
        } else {
            setError(true)
        }
    }
    return (
        <div className="settings">
            <div className="settings__title">User info</div>
            <form className="settings__form form">
                <p className="form__title">Name</p>
                <input /*disabled={isRegister ? true : false}*/ value={name} type="text" placeholder={isRegister ? userName : 'Name...'} onChange={(event => setName(event.target.value))} className="form__input type_name" />
                <p className="form__title">Nick</p>
                <input /*disabled={isRegister ? true : false}*/ value={nick} type="text" placeholder={isRegister ? userNick : 'Nick...'} onChange={(event => setNick(event.target.value))} className="form__input type_nick" />
                <p className="form__title">Email</p>
                <input /*disabled={isRegister ? true : false}*/ value={email} type="text" placeholder={isRegister ? userEmail : 'Email...'} onChange={(event => setEmail(event.target.value))} className="form__input type_email" />
                <p className="form__title">Password</p>
                <input /*disabled={isRegister ? true : false}*/ value={password} type="password" placeholder={isRegister ? '*****' : 'Password...'} onChange={(event => setPassword(event.target.value))} className="form__input type_password" />
                <div className={error ? 'error color_red' : 'error color_green'}>{error === null ? '' : (error ? 'Error. Some data was entered incorrectly or user with this data already exists' : 'Saved successfully')}</div>
                <div className="status">{isRegister ? 'You are logged in' : 'Click the button to log in'}</div>
                <button onClick={onButton} className="change__status">{isRegister ? 'Change data' : 'Log in'}</button>
            </form>
        </div>
    );
}

export default Settings;