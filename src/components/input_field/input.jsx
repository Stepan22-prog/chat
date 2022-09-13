import React, { useState } from 'react';
import './input.css';
import { CSSTransition } from 'react-transition-group';
import { useEffect } from 'react';

const Input = ({ setUserMassege, buttonText }) => {
    const [value, setValue] = useState('');
    const [inProp, setInProp] = useState(false);
    const onButton = () => {
        if (value.trim()) {
            setUserMassege(value.trim());
        }
        setValue('');
    }
    useEffect(() => {
        const onKeypress = e => {
            if (e.key === 'Enter') {
                onButton();
                e.preventDefault();
            }
        }

        document.addEventListener('keyup', onKeypress);

        return () => {
            document.removeEventListener('keyup', onKeypress);
        };
    })
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