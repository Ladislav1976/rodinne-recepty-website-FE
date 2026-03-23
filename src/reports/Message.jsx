import style from '../assets/styles/Reports/Message.module.css';
import { useEffect, useRef, useState } from 'react';

export default function Message(props) {
    const msgRef = useRef();
    const [isVisible, setIsVisible] = useState(false);
    const isError = props.isError;

    useEffect(() => {
        setIsVisible(true);
        msgRef.current.focus();
        setTimeout(() => {
            setIsVisible(false);
        }, 2000);
    }, []);

    return (
        <>
            <div className={`${style.box} ${isError ? style.isError : ''}`}>
                <h3 ref={msgRef}>{props.item}</h3>
            </div>
            <div
                className={`${style.boxOverlay} ${isVisible ? style.active : ''}`}
            >
                <div
                    className={`${style.boxMobile} ${isError ? style.isError : ''}`}
                >
                    <p ref={msgRef}>{props.item}</p>
                </div>
            </div>
        </>
    );
}
