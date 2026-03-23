import React, { useState, useRef } from 'react';
import style from '../assets/styles/Components/Unit.module.css';

import useAxiosPrivate from '../hooks/useAxiosPrivate';

import { usePostUnit } from '../hooks/Mutations/usePostUnit';

export default function Unit() {
    const [errMsg, setErrMsg] = useState('');
    let unitRef = useRef();
    let errRef = useRef();
    const axiosPrivate = useAxiosPrivate();

    const postUnit = usePostUnit(axiosPrivate);

    function showErr(message) {
        setErrMsg(message);

        setTimeout(() => {
            setErrMsg('');
        }, 3000);
    }

    async function handleSave(e) {
        e.preventDefault();
        const textUnit = unitRef.current.value;

        if (textUnit) {
            try {
                const res = await postUnit.mutateAsync({ unit: textUnit });

                if (res) {
                    unitRef.current.value = '';
                }
            } catch (err) {
                if (err.response.data.unit) {
                    showErr(err.response.data.unit);
                } else {
                    showErr('Jednotka nebola uložená');
                }
                unitRef.current.value = '';
                errRef.current.focus();
            }
        } else {
            showErr('Vložte novu jednotku');
        }
    }

    return (
        <>
            <div className={style.main}>
                <form className={style.form} onSubmit={handleSave}>
                    <label className={style.label} htmlFor="Jednotka">
                        Jednotka
                    </label>
                    <input
                        type="text"
                        className={style.inputUnit}
                        id="Jednotka"
                        placeholder="Vložit.."
                        ref={unitRef}
                        aria-required="true"
                        aria-invalid="true"
                    ></input>
                    <button className={style.button}>Uložiť</button>
                </form>{' '}
                <p
                    ref={errRef}
                    className={errMsg ? style.errmsg : style.offscreen}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>
            </div>
        </>
    );
}
