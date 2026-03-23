import { useRef, useState, useEffect } from 'react';

import style from '../assets/styles/Pages/Login.module.css';
import { useNavigate } from 'react-router-dom';
import CSRFToken from './CSFRToken';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from '../api/axios';
import receptyLogo from '../image/rodinneReceptyLogoCutted.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

const RESET_URL = 'forgot-password/';

const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function Succcess() {
    return (
        <div
            style={{
                color: 'rgb(2, 170, 16)',
                fontSize: '1rem',
                paddingBottom: '1rem',
            }}
        >
            <div>Žiadosť bola odoslaná.</div>
            <div>Skotrolujte si svoju emailovú schránku</div>
        </div>
    );
}
export default function Reset() {
    const navigate = useNavigate();
    const emailRef = useRef();
    const errRef = useRef();
    const successRef = useRef();

    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [validEmail, setValidEmail] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setErrMsg('');
    }, [email]);

    function successMsgShow() {
        setSuccessMsg(<Succcess />);

        setTimeout(() => {
            navigate('/login', { replace: true });
        }, 3000);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setIsLoading(true);
        const emailObject = JSON.stringify({ email: email });
        const v1 = EMAIL_REGEX.test(email);
        if (!v1) {
            setErrMsg('Invalid Entry');
            return;
        }
        try {
            await axios.post(RESET_URL, emailObject, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },

                // withCredentials: true
            });

            successMsgShow();
            setIsLoading(false);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('Problém so serverom');
            } else if (err.response?.status === 409) {
                setErrMsg(err.response?.data?.message);
            }
            errRef.current.focus();
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className={style.main}>
                <div className={style.layerMain}>
                    <div className={style.mainbox}>
                        <div className={style.lineLogo}>
                            <div className={style.lineGrey}>
                                Rodinne recepty
                            </div>
                            <div className={style.lineTrans}></div>
                        </div>
                        <div className={style.receptyLogo}>
                            <img src={receptyLogo} alt="" />
                        </div>
                        <div className={style.bottomContainer}>
                            {' '}
                            <p>Chcete sa prihlásiť?</p>
                            <Link to="/login" className={style.resetLink}>
                                Prihlásiť sa
                            </Link>
                        </div>
                        <div className={style.loginContainer}>
                            <div
                                ref={successRef}
                                className={
                                    successMsg ? style.succmsg : style.offscreen
                                }
                                aria-live="assertive"
                            ></div>
                            <div
                                ref={errRef}
                                className={
                                    errMsg ? style.errmsg : style.offscreen
                                }
                                aria-live="assertive"
                            >
                                {errMsg}
                            </div>{' '}
                            <div
                                className={style.topbox}
                                ref={successRef}
                                aria-live="assertive"
                            >
                                {' '}
                                <h1>Zmena hesla</h1>
                                {successMsg ? (
                                    <h1>{successMsg}</h1>
                                ) : (
                                    <>
                                        <h5>Zadajte svoju e-mailovú adresu,</h5>
                                        <h5>na ktorú Vám obratom zašleme</h5>
                                        <h5>inštrukcie na zmenu hesla.</h5>
                                    </>
                                )}
                            </div>
                            <div
                                className={
                                    isLoading
                                        ? style.loadingContainer
                                        : style.hide
                                }
                            >
                                <FontAwesomeIcon
                                    className={style.loadingIcon}
                                    icon={faSpinner}
                                    spin
                                ></FontAwesomeIcon>
                            </div>
                            <form
                                className={style.form}
                                onSubmit={handleSubmit}
                            >
                                <CSRFToken />

                                <div className={style.inputContainer}>
                                    <div className={style.inputBox}>
                                        <label
                                            className={style.label}
                                            htmlFor="email"
                                        >
                                            Email:
                                            <FontAwesomeIcon
                                                icon={faCheck}
                                                className={
                                                    validEmail
                                                        ? style.valid
                                                        : style.hide
                                                }
                                            />
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                                className={
                                                    validEmail || !email
                                                        ? style.hide
                                                        : style.invalid
                                                }
                                            />
                                        </label>
                                        <input
                                            type="email"
                                            className={style.input}
                                            id="email"
                                            ref={emailRef}
                                            placeholder="Vložte svoj email"
                                            autoComplete="off"
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            value={email}
                                            required
                                            aria-invalid={
                                                validEmail ? 'false' : 'true'
                                            }
                                            // aria-describedby="uidnote"
                                        />{' '}
                                        <div className={style.icon}>
                                            <FontAwesomeIcon
                                                icon={faEnvelope}
                                            />
                                        </div>{' '}
                                    </div>
                                    <button
                                        type="submit"
                                        className={style.button}
                                        disabled={!validEmail ? true : false}
                                    >
                                        Odoslať
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className={style.photo}></div>
                    </div>
                </div>
            </div>
        </>
    );
}
