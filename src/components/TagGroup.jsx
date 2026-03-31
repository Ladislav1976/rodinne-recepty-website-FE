import React, { useState, useRef } from 'react';
import style from '../assets/styles/components/TagGroup.module.css';

import useAxiosPrivate from '../hooks/useAxiosPrivate';

import { usePostTagGroup } from '../hooks/Mutations/usePostTagGroup';

export default function TagGroup() {
    const [errMsg, setErrMsg] = useState('');
    let groupNameRef = useRef();
    let errRef = useRef();
    const axiosPrivate = useAxiosPrivate();

    const postTagGroup = usePostTagGroup(axiosPrivate);

    function showErr(message) {
        setErrMsg(message);

        setTimeout(() => {
            setErrMsg('');
        }, 3000);
    }

    async function handleSave(e) {
        e.preventDefault();
        const textGroup = groupNameRef.current.value;

        if (textGroup) {
            try {
                const res = await postTagGroup.mutateAsync({
                    groupName: textGroup,
                });

                if (res) {
                    groupNameRef.current.value = '';
                }
            } catch (err) {
                if (err.response.data.groupName) {
                    showErr(err.response.data.groupName);
                } else {
                    showErr('Skupina nebola uložená');
                }

                groupNameRef.current.value = '';
                errRef.current.focus();
            }
        } else {
            showErr('Vložte novú skupinu');
        }
    }

    return (
        <>
            <div className={style.main}>
                <form className={style.form} onSubmit={handleSave}>
                    <label className={style.label} htmlFor="Kategória">
                        Kategória
                    </label>
                    <input
                        type="text"
                        className={style.inputTagGroup}
                        id="Kategória"
                        placeholder="Vložiť"
                        ref={groupNameRef}
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
