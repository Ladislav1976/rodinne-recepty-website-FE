import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import style from '../assets/styles/Pages/Login.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import useInput from '../hooks/useInput';

import receptyLogo from '../image/rodinneReceptyLogoCutted.png';

import {
    faEye,
    faEyeSlash,
    faEnvelope,
} from '@fortawesome/free-regular-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
const LOGIN_URL = 'login';
const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function Login() {
    const { setAuth, setCSRFToken, setPage, setPageSize, setOrdering } =
        useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const emailRef = useRef();

    const errRef = useRef();
    // eslint-disable-next-line no-unused-vars
    const [email, resetEmail, emailAttribs] = useInput('email', '');
    const [pwd, setPwd] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    const [validEmail, setValidEmail] = useState(false);

    // const [check, toggleCheck] = useToggle('persist', false);
    const togglePwdVisibility = () => {
        setShowPwd((prev) => !prev);
    };

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd]);

    function handlerSetErrMessage(message) {
        setErrMsg(message);
        setTimeout(() => {
            setErrMsg('');
        }, 5000);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        const v1 = EMAIL_REGEX.test(email);
        if (!v1) {
            setErrMsg('Invalid Entry');
            return;
        }

        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ email: email, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                },
            );

            const access_token = response?.data?.access_token;
            const userRes = response?.data?.user;
            const CSRFToken = response?.headers['x-csrftoken'];

            setAuth({ userRes, pwd, access_token });
            setCSRFToken(CSRFToken);
            setPage(1);
            setPageSize(20);
            setOrdering('date');

            setPwd('');
            window.localStorage.setItem('IsLogedIn', true);

            setIsLoading(false);
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                handlerSetErrMessage('Problém so serverom');
            } else if (err.response?.status === 400) {
                handlerSetErrMessage(err.response?.data?.message);
            } else if (err.response?.status === 401) {
                handlerSetErrMessage(err.response?.data?.message);
            }

            setIsLoading(false);
            errRef.current.focus();
        }
    }

    // const tooglePersist = () => {
    //     setPersist(prev => !prev)
    // }

    // useEffect(() => {
    //     localStorage.setItem('persist', persist)
    // }, [persist])
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
                            <img
                                src={receptyLogo}
                                alt="Rodinné recepty - logo"
                            />
                        </div>
                        <div className={style.loginContainer}>
                            {' '}
                            <div
                                ref={errRef}
                                className={
                                    errMsg ? style.errmsg : style.offscreen
                                }
                                aria-live="assertive"
                            >
                                {errMsg}
                            </div>
                            <div className={style.topbox}>
                                <h1>Vitajte späť!</h1>
                                <h4>Prihláste sa</h4>
                            </div>
                            <form
                                className={style.form}
                                onSubmit={handleSubmit}
                            >
                                <div className={style.inputContainer}>
                                    <div className={style.inputBox}>
                                        <input
                                            type="email"
                                            className={style.input}
                                            id="email"
                                            ref={emailRef}
                                            placeholder="Vložte svoj email"
                                            autoComplete="off"
                                            {...emailAttribs}
                                            required
                                            aria-invalid={
                                                validEmail ? 'false' : 'true'
                                            }
                                            aria-describedby="uidnote"
                                        />
                                        <div className={style.icon}>
                                            <FontAwesomeIcon
                                                icon={faEnvelope}
                                            />
                                        </div>{' '}
                                    </div>
                                    <div className={style.inputBox}>
                                        <input
                                            type={showPwd ? 'text' : 'password'}
                                            className={style.input}
                                            id="password"
                                            onChange={(e) =>
                                                setPwd(e.target.value)
                                            }
                                            value={pwd}
                                            required
                                        />{' '}
                                        <div className={style.icon} id="eye">
                                            <FontAwesomeIcon
                                                icon={
                                                    showPwd ? faEye : faEyeSlash
                                                }
                                                onClick={togglePwdVisibility}
                                                style={{
                                                    color: showPwd
                                                        ? 'limegreen'
                                                        : 'inherit',
                                                }}
                                            />
                                        </div>{' '}
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
                                    </div>{' '}
                                    <button
                                        type="submit"
                                        className={style.button}
                                        disabled={!validEmail || isLoading}
                                    >
                                        Odoslať
                                    </button>
                                </div>{' '}
                            </form>
                        </div>{' '}
                        <div className={style.bottomContainer}>
                            {' '}
                            <p>Zabudli ste svoje heslo?</p>
                            <Link to="/reset" className={style.resetLink}>
                                Zmeniť heslo
                            </Link>
                        </div>
                        <div className={style.photo}></div>
                    </div>
                </div>
            </div>
        </>
    );
}
