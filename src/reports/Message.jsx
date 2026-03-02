import style from '../assets/styles/Reports/Message.module.css';
import { useEffect, useState } from 'react';

export default function Message(props) {
    const [isVisible, setIsVisible] = useState(false);
    const isError = props.isError;

    useEffect(() => {
        setIsVisible(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 2000);
    }, []);

    return (
        <>
            <div className={`${style.box} ${isError ? style.isError : ''}`}>
                <h3>{props.item}</h3>
            </div>
            <div
                className={`${style.boxOverlay} ${isVisible ? style.active : ''}`}
            >
                <div
                    className={`${style.boxMobile} ${isError ? style.isError : ''}`}
                >
                    <p>{props.item}</p>
                </div>
            </div>
        </>
    );
}
