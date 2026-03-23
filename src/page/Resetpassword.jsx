import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    faCheck,
    faTimes,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from '../assets/styles/Pages/Login.module.css';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CSRFToken from './CSFRToken';
import Cookies from 'js-cookie';
import receptyLogo from '../image/rodinneReceptyLogoCutted.png';

// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const passwordChecks = {
    length: (p) => p.length >= 8,
    hasUpper: (p) => /[A-Z]/.test(p),
    hasLower: (p) => /[a-z]/.test(p),
    hasNumber: (p) => /[0-9]/.test(p),
    hasSpecial: (p) => /[!@#$%^&*]/.test(p),
};

const PWD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-=_+[\]{};':"\\|,.<>/?]).{8,24}$/;
const RESET_URL = 'reset-password/';

export default function ResetPassword() {
    const token = useParams();
    const navigate = useNavigate();
    const errRef = useRef();
    const successRef = useRef();

    const [pwd, setPwd] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [validPwd, setValidPwd] = useState(false);
    // const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [showCnPwd, setShowCnPwd] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [validMatch, setValidMatch] = useState(false);
    // const [matchFocus, setMatchFocus] = useState(false);
    const [points, setPoints] = useState(false);
    const [color, setColor] = useState(false);
    const [pwdStrength, setPwdStrength] = useState('Žiadne heslo');

    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const togglePwdVisibility = (set) => {
        set((prev) => !prev);
    };

    useEffect(() => {
        const currentPoints = Object.values(passwordChecks).filter((check) =>
            check(pwd),
        ).length;
        setPoints(currentPoints);

        if (pwd.length === 0) {
            setColor('rgb(253, 5, 5)');
            setPwdStrength('Veľmi slabé');
        } else if (currentPoints <= 2) {
            setColor('rgb(253, 63, 5)');
            setPwdStrength('Slabé');
        } else if (currentPoints <= 3) {
            setColor('rgb(253, 166, 5)');
            setPwdStrength('Stredné');
        } else if (currentPoints <= 4) {
            setColor('rgb(216, 253, 5)');
            setPwdStrength('Silné');
        } else {
            setColor('rgb(2, 170, 16)');
            setPwdStrength('Veľmi silné');
        }

        setValidPwd(currentPoints === 5);
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [pwd, matchPwd]);
    function successMsgShow() {
        setSuccessMsg('Heslo bolo zmenene!');

        setTimeout(() => {
            navigate('/login', { replace: true });
        }, 3000);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // setIsLoading(true);
        const v1 = PWD_REGEX.test(pwd);
        if (!v1) {
            setErrMsg('Invalid Entry');
            return;
        }
        try {
            const response = await axios.post(
                RESET_URL,

                {
                    password: pwd,
                    confirm_password: matchPwd,
                    reset_id: token.token,
                },

                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': Cookies.get('csrftoken'),
                    },
                    withCredentials: true,
                },
            );

            if (response.data) {
                successMsgShow();
                setPwd('');
                setMatchPwd('');
            }
        } catch (err) {
            if (!err?.response) {
                setErrMsg('Problém so serverom');
            } else if (err.response?.status === 409) {
                setErrMsg(` ${err.data.message} `);
            } else if (err.response?.status === 408) {
                setErrMsg(`${err.data.message}`);
            } else {
                setErrMsg(`${err.message}`);
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {/* {success ? (
                <main className={style.main}>
                    <section>
                        <h1>Success!</h1>
                        <p>
                            <a href="recepty">Sign In</a>
                        </p>
                    </section>
                </main>
            ) : ( */}
            <div className={style.main}>
                <div className={style.layerMain}>
                    <div className={style.mainbox}>
                        <div className={style.lineLogo}>
                            <div className={style.lineGrey}>
                                Rodinne recepty
                            </div>
                            <div className={style.lineTrans}></div>
                        </div>{' '}
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
                        {/* {success && (
                            <div className={style.main}>
                                <section>
                                    <h1>Zmena hesla prebehla úspešne!</h1>
                                </section>
                            </div>
                        )} */}
                        <div className={style.loginContainer}>
                            <div
                                ref={successRef}
                                className={
                                    successMsg ? style.succmsg : style.offscreen
                                }
                                aria-live="assertive"
                            >
                                {successMsg}
                            </div>
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
                                <h1>Zmeniť heslo</h1>
                            </div>
                            {/* <div
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
                            </div> */}
                            <form
                                className={style.form}
                                onSubmit={handleSubmit}
                            >
                                <CSRFToken />
                                <div className={style.inputContainer}>
                                    <div className={style.inputBox}>
                                        <label
                                            className={style.label}
                                            htmlFor="password"
                                        >
                                            Heslo:
                                            <FontAwesomeIcon
                                                icon={faInfoCircle}
                                                className={style.info}
                                                onClick={() =>
                                                    setShowInfo(!showInfo)
                                                }
                                            />
                                            <div
                                                id="status-heslo"
                                                className={`
                                    ${style.instructions} 
                                    ${showInfo ? style.showMobile : ''}
                                        `}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faInfoCircle}
                                                />
                                                <strong>
                                                    Požiadavky na heslo:
                                                </strong>
                                                <br /> 8 to 24 znakov, veľké a
                                                malé písmená, číslicu a
                                                špeciálny znak.
                                                <br />
                                                Povolené špeciálne znaky: ! @ #
                                                $ % *
                                            </div>
                                            {/* <FontAwesomeIcon
                                                icon={faCheck}
                                                className={
                                                    validPwd
                                                        ? style.valid
                                                        : style.hide
                                                }
                                            />
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                                className={
                                                    validPwd || !pwd
                                                        ? style.hide
                                                        : style.invalid
                                                }
                                            /> */}
                                        </label>
                                        <input
                                            type={showPwd ? 'text' : 'password'}
                                            className={style.input}
                                            id="password"
                                            onChange={(e) =>
                                                setPwd(e.target.value)
                                            }
                                            value={pwd}
                                            required
                                            aria-invalid={
                                                validPwd ? 'false' : 'true'
                                            }
                                            aria-describedby="status-heslo"
                                            // onFocus={() => setPwdFocus(true)}
                                            // onBlur={() => setPwdFocus(false)}
                                        />{' '}
                                        <div className={style.semafor}>
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <div
                                                    id="status-heslo"
                                                    aria-label={pwdStrength}
                                                    key={num}
                                                    className={`${style.light}${
                                                        points >= num
                                                            ? style.isActive
                                                            : ''
                                                    }`}
                                                    style={{
                                                        backgroundColor:
                                                            points >= num
                                                                ? color
                                                                : 'grey',
                                                        opacity:
                                                            points >= num
                                                                ? 1
                                                                : 0.3, // Nepovinné: zhasnuté svetlá budú jemne priesvitné
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                        <div
                                            className={style.icon}
                                            onClick={() =>
                                                togglePwdVisibility(setShowPwd)
                                            }
                                            id="eye"
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    showPwd ? faEye : faEyeSlash
                                                }
                                                style={{
                                                    color: showPwd
                                                        ? 'limegreen'
                                                        : 'inherit',
                                                }}
                                            />
                                        </div>{' '}
                                    </div>
                                    <div className={style.inputBox}>
                                        <label
                                            className={style.label}
                                            htmlFor="passwordConfirm"
                                        >
                                            Potvrdiť heslo:
                                            <FontAwesomeIcon
                                                icon={faCheck}
                                                className={
                                                    validMatch && matchPwd
                                                        ? style.valid
                                                        : style.hide
                                                }
                                            />
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                                className={
                                                    validMatch || !matchPwd
                                                        ? style.hide
                                                        : style.invalid
                                                }
                                            />
                                        </label>
                                        <input
                                            type="password"
                                            className={style.input}
                                            id="passwordConfirm"
                                            onChange={(e) =>
                                                setMatchPwd(e.target.value)
                                            }
                                            value={matchPwd}
                                            required
                                            aria-invalid={
                                                validMatch ? 'false' : 'true'
                                            }
                                            aria-describedby="oko"
                                            // onFocus={() => setMatchFocus(true)}
                                            // onBlur={() => setMatchFocus(false)}
                                        />
                                        <div
                                            className={style.icon}
                                            onClick={() =>
                                                togglePwdVisibility(
                                                    setShowCnPwd,
                                                )
                                            }
                                            id="oko"
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    showCnPwd
                                                        ? faEye
                                                        : faEyeSlash
                                                }
                                                style={{
                                                    color: showCnPwd
                                                        ? 'limegreen'
                                                        : 'inherit',
                                                }}
                                            />
                                        </div>{' '}
                                        {/* <p
                                                id="confirmnote"
                                                className={
                                                    matchFocus && !validMatch
                                                        ? style.instructions
                                                        : style.offscreen
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faInfoCircle}
                                                />
                                                Must match the first password
                                                input field.
                                            </p> */}
                                    </div>{' '}
                                    <button
                                        type="submit"
                                        className={style.button}
                                        disabled={
                                            !validPwd || !validMatch
                                                ? true
                                                : false
                                        }
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
