import style from '../assets/styles/reports/Delete.module.css';
import { useRef, useEffect, useState } from 'react';

export default function Confirm(props) {
    const [isVisible, setIsVisible] = useState(false);
    const setIsSaving = props.setIsSaving;
    const is_deleted = props.is_deleted;
    const deleteRef = useRef();
    const cancelRef = useRef();
    const errRef = useRef();
    const errMsg = props.errMsg;

    useEffect(() => {
        cancelRef.current.focus();
    }, []);

    useEffect(() => {
        errRef.current.focus();
    }, [errMsg]);

    useEffect(() => {
        setIsVisible(true);
    }, []);
    async function handleDelete() {
        setIsSaving(true);
        try {
            const res = await props.do();

            if (res && res.status >= 200 && res.status < 300) {
                handleCloseShowMessage(
                    is_deleted === 'true' ? 'Recept bol obnovený.' : 'Recept bol vymazaný.',
                    false
                );
            }
        } catch (err) {
            console.error('err', err);
            if (err.status && err.response.data.detail) {
                handleCloseShowMessage(err.response.data.detail, true);
            } else {
                handleCloseShowMessage(`⚠️ Problem so serverom.`, true);
            }
        }
    }
    function handleCloseShowMessage(message, isError) {
        setIsVisible(false);

        setTimeout(() => {
            props.handleDoConfirmed(message, isError);
        }, 500);
    }

    function handleClose() {
        setIsVisible(false);

        setTimeout(() => {
            props.cancel();
        }, 500);
    }
    return (
        <>
            <div className={style.box}>
                <h3>
                    {props.message} <br />
                    Chcete pokračovať?
                </h3>

                <div className={style.buttonContainer}>
                    <button
                        ref={deleteRef}
                        className={`${style.button} ${style.delete}`}
                        onClick={handleDelete}
                    >
                        ANO
                    </button>
                    <button
                        ref={cancelRef}
                        className={`${style.button} ${style.cancel}`}
                        onClick={props.cancel}
                    >
                        NIE
                    </button>
                </div>
                <p
                    ref={errRef}
                    className={errMsg ? style.errmsg : style.offscreen}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>
            </div>
            <div
                className={`${style.boxOverlay} ${isVisible ? style.active : ''}`}
                onClick={handleClose}
            >
                <div className={style.boxMobile}>
                    <p>
                        {props.message} <br />
                        Chcete pokračovať?
                    </p>
                    <div className={style.buttonContainer}>
                        <button
                            className={`${style.button} ${style.delete}`}
                            onClick={handleDelete}
                        >
                            ANO
                        </button>
                        <button className={`${style.button} ${style.cancel}`} onClick={handleClose}>
                            NIE
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
