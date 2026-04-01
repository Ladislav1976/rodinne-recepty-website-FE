import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import useEmailFormSubmit from '../hooks/useEmailFormSubmit';
import { useItemsDownload } from '../hooks/queries/useItemsDownload';
import style from '../assets/styles/pages/SubmitFood.module.css';

import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faBackward, faSpinner } from '@fortawesome/free-solid-svg-icons';

import Message from '../reports/Message';
import ModalMessage from '../modals/ModalMessage';

const EMAIL_URL = 'https://api.emailjs.com/api/v1.0/email/send';
const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function SubmitFood(props) {
    const id = useParams();
    let ID = parseInt(id.id);

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const goBack = () => navigate(-1, { replace: true });

    const { auth } = useAuth();

    const form = useRef();
    const emailRef = useRef();

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [modalMessageFlag, setModalMessageFlag] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const [emailMessage, setEmailMessage] = useState(
        `Dobrý deň,\n\nPodľa našej dohody Vám zasielam podrobný recept.\n\nS pozdravom\n${auth?.userRes?.first_name} ${auth?.userRes?.last_name}`
    );
    const params = new URLSearchParams(window.location.search);
    const itemsDw = useItemsDownload(ID, axiosPrivate, isSaving, params);

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    const [name, setName] = useState('');
    const [stepsList, setStepsList] = useState([]);
    const [ingredientsList, setIngredientsList] = useState([]);
    const [urlList, setUrlList] = useState([]);

    const food_form = useEmailFormSubmit(name, stepsList, ingredientsList, urlList);

    useEffect(() => {
        if (!itemsDw.isLoading && itemsDw.data) {
            setName(itemsDw.data.name);
            setStepsList(itemsDw.data.steps);
            setIngredientsList(itemsDw.data.ingredientsGroup);
            setUrlList(itemsDw.data.urls);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsDw.data]);

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
            setIsSaving(false);
        }, 3000);
    }
    async function sendEmail(e) {
        e.preventDefault();

        if (!validEmail) {
            showMessage('Neplatna email adresa!', true);
            return;
        }
        setIsLoading(true);
        const serviceId = 'service_35q6ps9';
        const templateId = 'template_jizuh7j';
        const publicKey = 'KVWK7w-1jgmN_ohjf';

        const data = {
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,

            template_params: {
                from_name: `${auth?.userRes?.first_name} ${auth?.userRes?.last_name}`,
                from_email: auth?.userRes?.email,
                to_email: email,
                message: emailMessage,
                food_form: food_form,
                html: `<h1>Hello</h1><img src="cid:unique@image"/>`,
            },
        };

        try {
            const response = await axios.post(EMAIL_URL, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response) {
                showMessage('Email bol úspešne odoslaný!', false);
            }
        } catch (err) {
            if (!err?.respons) {
                showMessage('No Server Response', true);
            } else if (err.response?.status === 409) {
                showMessage(err.response?.data?.message || 'Chyba pri odosielaní', true);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {' '}
            <div className={style.main}>
                <div className={style.panel}>
                    <div className={style.messagebox}>{props.errMsg}</div>
                    <div className={style.buttonBox}>
                        <div className={style.foodButton} onClick={goBack}>
                            <FontAwesomeIcon icon={faBackward} />
                        </div>
                    </div>
                </div>

                <>
                    <div className={style.submitContainer}>
                        <form className={style.form} ref={form} onSubmit={sendEmail} id="food_form">
                            <h2>Odoslať recept</h2>
                            <div className={style.inputContainer}>
                                <label className={style.label} htmlFor="email">
                                    Email :
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        className={validEmail ? style.valid : style.hide}
                                    />
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        className={
                                            validEmail || !email ? style.offScreen : style.invalid
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
                                    />
                                </div>
                                <label className={style.label} htmlFor="emailová správa">
                                    Správa:
                                </label>
                                <div className={style.inputBox}>
                                    <textarea
                                        type="text"
                                        id="emailová správa"
                                        autoComplete="off"
                                        onChange={(e) => setEmailMessage(e.target.value)}
                                        value={emailMessage}
                                        rows="10"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={style.button}
                                disabled={!validEmail ? true : false}
                            >
                                Odoslať
                                <span> &#10095; </span>
                            </button>
                        </form>
                    </div>
                    <div className={isLoading ? style.loadingContainer : style.offScreen}>
                        <FontAwesomeIcon
                            className={style.loadingIcon}
                            icon={faSpinner}
                            id="inpFileIcon"
                            spin
                        ></FontAwesomeIcon>
                    </div>
                </>
            </div>
            <ModalMessage visible={modalMessageFlag} setModalFlag={setModalMessageFlag}>
                <Message item={message} isError={isError}></Message>
            </ModalMessage>
        </>
    );
}
