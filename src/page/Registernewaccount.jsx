import { useRef, useState, useEffect } from 'react';

import { faCheck, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from '../assets/styles/pages/RegisterNewAccount.module.css';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import CSRFToken from './CSFRToken';
import ModalMessage from '../modals/ModalMessage';
import Message from '../reports/Message';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const REGISTER_URL = 'register';

export default function RegisterNewAccount() {
    const { page, pageSize, ordering } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [isLoading, setIsLoading] = useState(false);
    const [modalMessageFlag, setModalMessageFlag] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');

    const first_name_Ref = useRef();

    const emailRef = useRef();
    const errRef = useRef();

    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');

    const [email, setEmail] = useState('');
    const [validFirst_name, setValidFirst_name] = useState(false);
    const [validLast_name, setValidLast_name] = useState(false);

    const [validEmail, setValidEmail] = useState(false);

    const navigate = useNavigate();
    const nav = `/recepty?ordering=${ordering}&page=${page}&page_size=${pageSize}`;
    const goBack = () => navigate(nav, { replace: true });

    useEffect(() => {
        first_name_Ref.current.focus();
    }, []);

    useEffect(() => {
        setValidFirst_name(USER_REGEX.test(first_name));
    }, [first_name]);

    useEffect(() => {
        setValidLast_name(USER_REGEX.test(last_name));
    }, [last_name]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    function showMessage(message, isError) {
        setIsError(isError);
        setMessage(message);
        setModalMessageFlag(true);
        setTimeout(() => {
            if (!isError) {
                goBack();
            }

            setModalMessageFlag(false);
            setMessage('');
        }, 3000);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        const controller = new AbortController();

        const v1 = USER_REGEX.test(first_name);
        const v2 = USER_REGEX.test(last_name);
        const v3 = EMAIL_REGEX.test(email);
        if (!v1 || !v2 || !v3) {
            showMessage('Invalid Entry', true);
            return;
        }
        try {
            await axiosPrivate.post(
                REGISTER_URL,
                JSON.stringify({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                }),
                {
                    signal: controller.signal,
                }
            );
            showMessage(`Nový účet pre ${email} bol vytvorený!`, false);

            setIsLoading(false);

            setFirst_name('');
            setLast_name('');
            setEmail('');
        } catch (err) {
            if (!err?.response) {
                showMessage('No Server Response', true);
            } else if (err.response?.status === 409) {
                showMessage(`Tento ${err.response?.data.message} je už zaregistrovaný`, true);
            } else {
                showMessage('Registrácia zlyhala', true);
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            <div className={style.main}>
                <div className={!isLoading ? style.submitContainer : style.offScreen}>
                    <form
                        onSubmit={handleSubmit}
                        className={!isLoading ? style.form : style.offscreen}
                    >
                        <h1>Registrácia</h1>
                        <CSRFToken />
                        <div className={style.inputContainer}>
                            <label className={style.label} htmlFor="KrstnéMeno">
                                Meno:
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className={validFirst_name ? style.valid : style.hide}
                                />
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    className={
                                        validFirst_name || !first_name ? style.hide : style.invalid
                                    }
                                />
                            </label>
                            <div className={style.inputBox}>
                                <input
                                    type="text"
                                    className={style.input}
                                    id="KrstnéMeno"
                                    ref={first_name_Ref}
                                    autoComplete="off"
                                    onChange={(e) => setFirst_name(e.target.value)}
                                    value={first_name}
                                    required
                                    aria-invalid={validFirst_name ? 'false' : 'true'}
                                    aria-describedby="uidnote"
                                />
                            </div>
                            <label className={style.label} htmlFor="Priezvisko">
                                Priezvisko:
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className={validLast_name ? style.valid : style.hide}
                                />
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    className={
                                        validLast_name || !last_name ? style.hide : style.invalid
                                    }
                                />
                            </label>
                            <div className={style.inputBox}>
                                <input
                                    type="text"
                                    className={style.input}
                                    id="Priezvisko"
                                    autoComplete="off"
                                    onChange={(e) => setLast_name(e.target.value)}
                                    value={last_name}
                                    required
                                    aria-invalid={validLast_name ? 'false' : 'true'}
                                />
                            </div>
                            <label className={style.label} htmlFor="email">
                                Email:
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className={validEmail ? style.valid : style.hide}
                                />
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    className={validEmail || !email ? style.hide : style.invalid}
                                />
                            </label>
                            <div className={style.inputBox}>
                                <input
                                    type="email"
                                    className={style.input}
                                    id="email"
                                    ref={emailRef}
                                    placeholder="email@gmail.com"
                                    autoComplete="off"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                    aria-invalid={validEmail ? 'false' : 'true'}
                                />
                            </div>
                        </div>
                        <button
                            className={style.button}
                            disabled={
                                !validFirst_name || !validLast_name || !validEmail ? true : false
                            }
                        >
                            Odoslať
                        </button>
                        <div className={isLoading ? style.loadingContainer : style.offScreen}>
                            <FontAwesomeIcon
                                className={style.loadingIcon}
                                icon={faSpinner}
                                id="inpFileIcon"
                                spin
                            ></FontAwesomeIcon>
                        </div>
                    </form>
                </div>
            </div>{' '}
            <ModalMessage visible={modalMessageFlag} setModalFlag={setModalMessageFlag}>
                <Message item={message} isError={isError}></Message>
            </ModalMessage>
        </>
    );
}
