import { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from '../assets/styles/Pages/RegisterNewAccount.module.css';
import axios from '../api/axios';
import CSRFToken from './CSFRToken';
import Cookies from 'js-cookie';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = 'register';

export default function Register() {
    const first_name_Ref = useRef();
    const last_name_Ref = useRef();
    const user_name_Ref = useRef();
    const emailRef = useRef();
    const errRef = useRef();

    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [user_name, setUser_name] = useState('');
    const [email, setEmail] = useState('');
    const [validFirst_name, setValidFirst_name] = useState(false);
    const [validLast_name, setValidLast_name] = useState(false);
    const [validUser_name, setValidUser_name] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [first_nameFocus, setFirst_nameFocus] = useState(false);
    const [last_nameFocus, setLast_nameFocus] = useState(false);
    const [user_nameFocus, setUser_nameFocus] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        first_name_Ref.current.focus();
    }, []);

    useEffect(() => {
        last_name_Ref.current.focus();
    }, []);

    useEffect(() => {
        user_name_Ref.current.focus();
    }, []);

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        setValidFirst_name(USER_REGEX.test(first_name));
    }, [first_name]);

    useEffect(() => {
        setValidLast_name(USER_REGEX.test(last_name));
    }, [last_name]);

    useEffect(() => {
        setValidUser_name(USER_REGEX.test(user_name));
    }, [user_name]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [first_name, last_name, user_name, email, pwd, matchPwd]);

    async function handleSubmit(e) {
        e.preventDefault();

        const v1 = USER_REGEX.test(first_name);
        const v2 = USER_REGEX.test(last_name);
        const v3 = USER_REGEX.test(user_name);
        const v4 = PWD_REGEX.test(pwd);
        const v5 = EMAIL_REGEX.test(email);
        if (!v1 || !v2 || !v3 || !v4 || !v5) {
            setErrMsg('Invalid Entry');
            return;
        }
        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                }),

                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRFToken': Cookies.get('csrftoken'),
                    },
                    withCredentials: true,
                }
            );
            if (response) {
                setSuccess(true);
                setFirst_name('');
                setLast_name('');
                setUser_name('');
                setEmail('');
                setPwd('');
                setMatchPwd('');
            }
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg(`Tento ${err.response?.data.message} je uz zaregistrovany`);
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <div className={style.main}>
                    <section>
                        <h1>Success!</h1>
                        <p>
                            <a href="recepty">Sign In</a>
                        </p>
                    </section>
                </div>
            ) : (
                <div className={style.main}>
                    <div className={style.registerContainer}>
                        <p
                            ref={errRef}
                            className={errMsg ? style.errmsg : style.offscreen}
                            aria-live="assertive"
                        >
                            {errMsg}
                        </p>

                        <form className={style.form} onSubmit={handleSubmit}>
                            <h1>Registrácia</h1>
                            <CSRFToken />
                            <div className={style.inputContainer}>
                                <div className={style.inputBox}>
                                    <label className={style.label} htmlFor="KrstnéMeno">
                                        Meno:
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            className={validFirst_name ? style.valid : style.hide}
                                        />
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            className={
                                                validFirst_name || !first_name
                                                    ? style.hide
                                                    : style.invalid
                                            }
                                        />
                                    </label>
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
                                        onFocus={() => setFirst_nameFocus(true)}
                                        onBlur={() => setFirst_nameFocus(false)}
                                    />
                                    <p
                                        id="uidnote"
                                        className={
                                            first_nameFocus && first_name && !validFirst_name
                                                ? style.instructions
                                                : style.offscreen
                                        }
                                    >
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        4 to 24 characters.
                                        <br />
                                        Must begin with a letter.
                                        <br />
                                        Letters, numbers, underscores, hyphens allowed.
                                    </p>
                                </div>

                                <div className={style.inputBox}>
                                    <label className={style.label} htmlFor="Priezvisko">
                                        Priezvisko:
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            className={validLast_name ? style.valid : style.hide}
                                        />
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            className={
                                                validLast_name || !last_name
                                                    ? style.hide
                                                    : style.invalid
                                            }
                                        />
                                    </label>
                                    <input
                                        type="text"
                                        className={style.input}
                                        id="Priezvisko"
                                        ref={last_name_Ref}
                                        autoComplete="off"
                                        onChange={(e) => setLast_name(e.target.value)}
                                        value={last_name}
                                        required
                                        aria-invalid={validLast_name ? 'false' : 'true'}
                                        aria-describedby="uidnote"
                                        onFocus={() => setLast_nameFocus(true)}
                                        onBlur={() => setLast_nameFocus(false)}
                                    />
                                    <p
                                        id="uidnote"
                                        className={
                                            last_nameFocus && last_name && !validLast_name
                                                ? style.instructions
                                                : style.offscreen
                                        }
                                    >
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        4 to 24 characters.
                                        <br />
                                        Must begin with a letter.
                                        <br />
                                        Letters, numbers, underscores, hyphens allowed.
                                    </p>
                                </div>

                                <div className={style.inputBox}>
                                    <label className={style.label} htmlFor="MenoUžívateľa">
                                        Meno:
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            className={validUser_name ? style.valid : style.hide}
                                        />
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            className={
                                                validUser_name || !user_name
                                                    ? style.hide
                                                    : style.invalid
                                            }
                                        />
                                    </label>
                                    <input
                                        type="text"
                                        className={style.input}
                                        id="MenoUžívateľa"
                                        ref={user_name_Ref}
                                        autoComplete="off"
                                        onChange={(e) => setUser_name(e.target.value)}
                                        value={user_name}
                                        required
                                        aria-invalid={validUser_name ? 'false' : 'true'}
                                        aria-describedby="uidnote"
                                        onFocus={() => setUser_nameFocus(true)}
                                        onBlur={() => setUser_nameFocus(false)}
                                    />
                                    <p
                                        id="uidnote"
                                        className={
                                            user_nameFocus && user_name && !validUser_name
                                                ? style.instructions
                                                : style.offscreen
                                        }
                                    >
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        4 to 24 characters.
                                        <br />
                                        Must begin with a letter.
                                        <br />
                                        Letters, numbers, underscores, hyphens allowed.
                                    </p>
                                </div>
                                <label className={style.label} htmlFor="email">
                                    Email:
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        className={validFirst_name ? style.valid : style.hide}
                                    />
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        className={
                                            validFirst_name || !first_name
                                                ? style.hide
                                                : style.invalid
                                        }
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
                                        aria-describedby="uidnote"
                                        onFocus={() => setEmailFocus(true)}
                                        onBlur={() => setEmailFocus(false)}
                                    />
                                    <p
                                        id="uidnote"
                                        className={
                                            emailFocus && email && !validEmail
                                                ? style.instructions
                                                : style.offscreen
                                        }
                                    >
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        Povolené znaky: <br />- písmená, číslice, bodky
                                        <br />- symbol „@“,
                                        <br />
                                        - .sk .com, .org, .cc
                                        <br />
                                    </p>
                                </div>

                                <label htmlFor="password" className={style.label}>
                                    Heslo:
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        className={validPwd ? style.valid : style.hide}
                                    />
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        className={validPwd || !pwd ? style.hide : style.invalid}
                                    />
                                </label>
                                <div className={style.inputBox}>
                                    <input
                                        type="password"
                                        className={style.input}
                                        id="password"
                                        onChange={(e) => setPwd(e.target.value)}
                                        value={pwd}
                                        required
                                        aria-invalid={validPwd ? 'false' : 'true'}
                                        aria-describedby="hesloPoznamka"
                                        onFocus={() => setPwdFocus(true)}
                                        onBlur={() => setPwdFocus(false)}
                                    />
                                    <p
                                        id="hesloPoznamka"
                                        className={
                                            pwdFocus && !validPwd
                                                ? style.instructions
                                                : style.offscreen
                                        }
                                    >
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        8 až 24 znakov.
                                        <br />
                                        Musí obsahovať: <br />- veľké a malé písmená, číslice,
                                        špeciálne znaky.
                                        <br />
                                        Povolené špeciálne znaky:
                                        <span aria-label="výkričník">!</span>{' '}
                                        <span aria-label="zavináč ">@</span>{' '}
                                        <span aria-label="mriežka">#</span>{' '}
                                        <span aria-label="značka dolára">$</span>{' '}
                                        <span aria-label="percento">%</span>{' '}
                                    </p>
                                </div>

                                <label htmlFor="passwordConfirm" className={style.label}>
                                    Potvrdiť heslo:
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        className={
                                            validMatch && matchPwd ? style.valid : style.hide
                                        }
                                    />
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        className={
                                            validMatch || !matchPwd ? style.hide : style.invalid
                                        }
                                    />
                                </label>
                                <div className={style.inputBox}>
                                    <input
                                        type="password"
                                        className={style.input}
                                        id="passwordConfirm"
                                        onChange={(e) => setMatchPwd(e.target.value)}
                                        value={matchPwd}
                                        required
                                        aria-invalid={validMatch ? 'false' : 'true'}
                                        aria-describedby="confirmpwd"
                                        onFocus={() => setMatchFocus(true)}
                                        onBlur={() => setMatchFocus(false)}
                                    />
                                    <p
                                        id="confirmpwd"
                                        className={
                                            matchFocus && !validMatch
                                                ? style.instructions
                                                : style.offscreen
                                        }
                                    >
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        Musí sa zhodovať s prvým heslom.
                                    </p>
                                </div>
                            </div>
                            <button
                                disabled={!validEmail || !validPwd || !validMatch ? true : false}
                            >
                                Odoslať
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
