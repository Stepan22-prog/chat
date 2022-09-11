import React, { useState } from 'react';
import './input.css'

const Input = ({ setUserMassege, buttonText }) => {
    const [value, setValue] = useState('');
    const onButton = () => {
        if (value.trim()) {
            setUserMassege(value.trim());
        }
        setValue('');
    }
    return (
        <div className="input-block">
            <textarea className='input-block__input' placeholder='Type smth...' value={value} onChange={(event) => setValue(event.target.value)} type="text" />
            <button className='input-block__btn' onClick={onButton}><span className='input-block-btn__text'>{buttonText}</span><span className="input-block-btn__arrow"></span></button>
        </div>
    );
}

export default Input;