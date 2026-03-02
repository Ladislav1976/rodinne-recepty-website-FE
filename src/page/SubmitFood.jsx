/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import useEmailFormSubmit from '../hooks/useEmailFormSubmit';
import { useItemsDownload } from '../hooks/Queries/useItemsDownload';
import styla from '../assets/styles/Pages/SubmitFood.module.css';

import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faTimes,
    faBackward,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';

const EMAIL_URL = 'https://api.emailjs.com/api/v1.0/email/send';
const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function SubmitFood(props) {
    const id = useParams();
    let ID = parseInt(id.id);

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    const { auth } = useAuth();
    const itemsDw = useItemsDownload(ID, axiosPrivate);

    const form = useRef();
    const emailRef = useRef();

    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const [message, setMessage] = useState(
        `Dobrý deň,\n\nPodľa našej dohody Vám zasielam podrobný recept.\n\nS pozdravom\n${auth?.userRes?.first_name} ${auth?.userRes?.last_name}`,
    );

    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();

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
    const [imageURLsList, setImageURLsList] = useState([]);

    const food_form = useEmailFormSubmit(
        name,
        stepsList,
        ingredientsList,
        urlList,
        imageURLsList,
    );

    useEffect(() => {
        if (!itemsDw.isLoading && itemsDw.data) {
            setName(itemsDw.data.name);
            setStepsList(itemsDw.data.steps);
            setIngredientsList(itemsDw.data.ingredients);
            setUrlList(itemsDw.data.urls);
            setImageURLsList(itemsDw.data.images);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsDw.data]);
    async function sendEmail(e) {
        e.preventDefault();
        setErrMsg('Neplatna email adresa!');
        if (!validEmail) {
            setErrMsg('Neplatna email adresa!');
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
                message: message,
                food_form: food_form,
                html: `<h1>Hello</h1><img src="cid:unique@image"/>`,

                // food_form:'food_form'
            },
        };

        try {
            const response = await axios.post(EMAIL_URL, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response) {
                setSuccess(true);
            }
        } catch (err) {
            if (!err?.respons) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg(
                    err.response?.data?.message || 'Chyba pri odosielaní',
                );
                errRef.current.focus();
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {' '}
            <div className={styla.main}>
                <div className={styla.panel}>
                    <div className={styla.messagebox}>{props.errMsg}</div>
                    <div className={styla.buttonBox}>
                        <div
                            className={styla.foodButton}
                            onClick={() => navigate(-1)}
                        >
                            <FontAwesomeIcon icon={faBackward} />
                        </div>
                    </div>
                </div>
                {success ? (
                    <div className={styla.submitContainer}>
                        <div className={styla.form}>
                            <h3>Email bol úspešne odoslaný!</h3>

                            <button className={styla.button} onClick={goBack}>
                                Späť
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div
                            className={
                                !isLoading
                                    ? styla.submitContainer
                                    : styla.offScreen
                            }
                        >
                            <form
                                className={styla.form}
                                ref={form}
                                onSubmit={sendEmail}
                                id="food_form"
                            >
                                <p
                                    ref={errRef}
                                    className={
                                        errMsg ? styla.errmsg : styla.offscreen
                                    }
                                    aria-live="assertive"
                                >
                                    {errMsg}
                                </p>
                                <h2>Odoslať recept</h2>
                                <div className={styla.inputContainer}>
                                    <label
                                        className={styla.label}
                                        htmlFor="email"
                                    >
                                        Email :
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            className={
                                                validEmail
                                                    ? styla.valid
                                                    : styla.hide
                                            }
                                        />
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            className={
                                                validEmail || !email
                                                    ? styla.offScreen
                                                    : styla.invalid
                                            }
                                        />
                                    </label>
                                    <div className={styla.inputBox}>
                                        <input
                                            type="email"
                                            className={styla.input}
                                            id="email"
                                            ref={emailRef}
                                            placeholder="email@gmail.com"
                                            autoComplete="off"
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            value={email}
                                            required
                                            aria-invalid={
                                                validEmail ? 'false' : 'true'
                                            }
                                            aria-describedby="uidnote"
                                        />
                                    </div>
                                    <label
                                        className={styla.label}
                                        htmlFor="message"
                                    >
                                        Správa:
                                    </label>
                                    <div className={styla.inputBox}>
                                        <textarea
                                            type="text"
                                            id="message"
                                            autoComplete="off"
                                            onChange={(e) =>
                                                setMessage(e.target.value)
                                            }
                                            value={message}
                                            rows="10"
                                            required
                                            aria-describedby="uidnote"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={styla.button}
                                    disabled={!validEmail ? true : false}
                                >
                                    Odoslať
                                    <span> &#10095; </span>
                                </button>
                            </form>
                        </div>
                        <div
                            className={
                                isLoading
                                    ? styla.loadingContainer
                                    : styla.offScreen
                            }
                        >
                            <FontAwesomeIcon
                                className={styla.loadingIcon}
                                icon={faSpinner}
                                id="inpFileIcon"
                                spin
                            ></FontAwesomeIcon>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
