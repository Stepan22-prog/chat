import React, { useState } from 'react';
import './input.css';
import { CSSTransition } from 'react-transition-group';

const Input = ({ setUserMassege, buttonText }) => {
    const [value, setValue] = useState('');
    const [inProp, setInProp] = useState(false);
    const onButton = () => {
        console.log('everything ok');
        if (value.trim()) {
            setUserMassege(value.trim());
        }
        setValue('');
    }
    return (
        <div className="input-block">
            <textarea className='input-block__input' placeholder='Type smth...' value={value} onChange={(event) => setValue(event.target.value)} type="text" />
            <CSSTransition in={inProp} timeout={150} classNames="input-button">
                <button className='input-block__btn' onClick={() => {
                    onButton();
                    inProp ? setInProp(false) : setInProp(true)
                }}><span className='input-block-btn__text'>{buttonText}</span><span className="input-block-btn__arrow"></span></button>
            </CSSTransition>
        </div>
    );
}

export default Input;