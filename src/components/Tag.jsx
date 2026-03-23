import { useRef, useState } from 'react';
import style from '../assets/styles/Components/Tag.module.css';

import useAxiosPrivate from '../hooks/useAxiosPrivate';

import { usePostTag } from '../hooks/Mutations/usePostTag';

export default function Tag({ tagGroupQf }) {
    let tagRef = useRef();
    let errRef = useRef();
    const [addedGroup, setAddedGroup] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();

    const postTag = usePostTag(axiosPrivate);

    function showErr(message) {
        setErrMsg(message);

        setTimeout(() => {
            setErrMsg('');
        }, 3000);
    }
    function sortingOptions(array) {
        return array
            ? [...array].sort((a, b) => a.groupName.localeCompare(b.groupName))
            : [];
    }

    async function handleSave(e) {
        e.preventDefault();
        const textTag = tagRef.current.value;
        if (!addedGroup) {
            showErr('Vyberte skupinu');
            return;
        }
        if (textTag) {
            try {
                const res = await postTag.mutateAsync({
                    group: addedGroup,
                    foodTag: textTag,
                });

                if (res) {
                    tagRef.current.value = '';
                    setAddedGroup('');
                }
            } catch (err) {
                if (err.response.data.foodTag) {
                    showErr(err.response.data.foodTag);
                } else {
                    showErr('Tag nebol uložený');
                }

                setAddedGroup('');
                tagRef.current.value = '';
                errRef.current.focus();
            }
        } else {
            setAddedGroup('');
            tagRef.current.value = '';
            showErr('Vložte nový tag');
        }
    }

    return (
        <>
            <div className={style.main}>
                {' '}
                <form className={style.form} onSubmit={handleSave}>
                    <label className={style.label} htmlFor="Oznacenie">
                        Označenie
                    </label>

                    <select
                        className={style.inputTagGroup}
                        onChange={(e) => setAddedGroup(e.target.value)}
                        value={addedGroup}
                    >
                        <option value="">Vyberte...</option>
                        {sortingOptions(tagGroupQf?.data).map(
                            (group) =>
                                group && (
                                    <option
                                        key={group.id || group.groupName}
                                        value={group.id}
                                    >
                                        {group.groupName}
                                    </option>
                                ),
                        )}
                    </select>
                    <input
                        type="text"
                        className={style.inputTagGroup}
                        id="Oznacenie"
                        placeholder="Vložiť.."
                        ref={tagRef}
                        aria-describedby={errMsg ? 'name-error' : undefined}
                        aria-required="true"
                        aria-invalid={errMsg ? 'true' : 'false'}
                    ></input>
                    <button className={style.button}>Uložiť</button>
                </form>{' '}
                <p
                    ref={errRef}
                    id="name-error"
                    tabIndex="-1"
                    className={errMsg ? style.errmsg : style.offscreen}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>
            </div>
        </>
    );
}
