import { useRef, useState, useEffect } from 'react';
import style from '../assets/styles/Components/UserProfile.module.css';
import { usePutUser } from '../hooks/Mutations/usePutUser';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import default_image from '../image/user_image.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

export default function UserProfile({ userCard, imagePreview, closeModal }) {
    const [images, setImages] = useState([]);
    const [imageDefault, setImageDefault] = useState('');
    const [imageContainer, setImageContainer] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [loaded, setLoaded] = useState(false);
    const errRef = useRef();
    const controller = new AbortController();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        errRef.current.focus();
    }, []);

    const putUser = usePutUser({
        setRole: null,
        setStatus: null,
        roleDefault: null,
        setRoleDefault: null,
        statusDefault: null,
        setStatusDefault: null,
        setImageContainer: setImageContainer,
        setImageDefault: setImageDefault,
        imageDefault: imageDefault,
        handlerSetError: handlerSetError,
        axiosPrivate,
        controller,
        closeModal,
    });

    function handlerSetError(message) {
        setErrMsg(message);
        setTimeout(() => {
            setErrMsg('');
        }, 3000);
    }

    function ensureArray(data) {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        return [data];
    }

    async function handlePostRole(e) {
        e.preventDefault();
        if (imageDefault !== '') {
            const imagesArray = ensureArray(imageContainer);
            const res = imagesArray[0];
            if (res && res.imageForBackEnd) {
                let form = new FormData();

                // form.append('email', userCard.email);
                // form.append('role', userCard.role);
                form.append('avatar', res.imageForBackEnd);
                form.append(
                    'upload_folder',
                    `${userCard.id}-${userCard.first_name || 'user'}-${userCard.last_name || 'profile'}`,
                );

                const formdataPut = {
                    id: userCard.id,
                    userForm: form,
                };

                try {
                    await putUser.mutateAsync(formdataPut);
                } catch (err) {
                    handlerSetError('Error');
                    setImageContainer({
                        image: imagePreview,
                        imageForBackEnd: null,
                    });
                    errRef.current.focus();
                }

                // });
            } else {
                handlerSetError('Prosím, vyberte obrázok.');
            }
        }
    }
    function onImageChange(e) {
        setImages([...e.target.files]);
    }
    useEffect(() => {
        if (userCard.avatar) {
            setImageDefault(userCard.avatar);
        }
        if (imagePreview) {
            setImageContainer({
                image: imagePreview,
                imageForBackEnd: null,
            });
        }
    }, [userCard, imagePreview]);
    // images for Posting
    useEffect(() => {
        if (images.length < 1) return;

        const image = images[0];
        const previewUrl = URL.createObjectURL(image);

        (images || []).forEach((image) => {
            setImageContainer({
                image: previewUrl,
                imageForBackEnd: image,
            });
            if (!imageDefault) {
                setImageDefault(previewUrl);
            }
        });
        return () => URL.revokeObjectURL(previewUrl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images]);
    const ROLES = [
        { role: 'Admin', viewRole: 'Admin' },
        { role: 'User_readOnly', viewRole: 'Read' },
        {
            role: 'User_edit',
            viewRole: 'Self Edit',
        },
        { role: 'Editor', viewRole: 'Edit' },
    ];

    return (
        <div className={style.main} key={userCard.id}>
            <form className={style.form} onSubmit={handlePostRole}>
                <h4>Základné údaje</h4>
                <div className={style.user_info}>
                    <p
                        ref={errRef}
                        className={errMsg ? style.errmsg : style.hiden}
                        aria-live="assertive"
                    >
                        {errMsg}
                    </p>
                    <div className={style.user_photo}>
                        <img
                            src={imageContainer.image || default_image}
                            loading="eager"
                            fetchPriority="high"
                            alt="Profilová fotka"
                            onLoad={() => setLoaded(true)}
                            style={{
                                opacity: loaded ? 1 : 0,
                                transition: 'opacity 0.5s ease-in',
                            }}
                        />
                        <input
                            className={style.imageinput}
                            type="file"
                            accept="image/jpeg,image/png,image/gif"
                            id="inpFile"
                            onChange={(e) => onImageChange(e)}
                            display="none"
                        />
                        <div className={style.imageLoadBox}>
                            <label
                                htmlFor="inpFile"
                                className={style.imageIcon}
                                datatooltip="Pridať fotografiu"
                            >
                                {' '}
                                <FontAwesomeIcon
                                    icon={faCamera}
                                    id="inpFileIcon"
                                ></FontAwesomeIcon>
                            </label>
                        </div>{' '}
                    </div>
                    <div className={style.user_details}>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Meno</th>
                                    <td>{userCard.first_name}</td>
                                </tr>
                                <tr>
                                    <th>Priezvisko</th>
                                    <td>{userCard.last_name}</td>
                                </tr>
                                <tr>
                                    <th>E-mail</th>
                                    <td>{userCard.email}</td>
                                </tr>{' '}
                                <tr>
                                    <th>Receptov</th>
                                    <td>{userCard.foods_count}</td>
                                </tr>{' '}
                                <tr>
                                    <th>Profil</th>
                                    <td>
                                        {ROLES.map((r) =>
                                            r.role === userCard?.role
                                                ? r.viewRole
                                                : '',
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>{' '}
                {/* <h4>Základnéee údaje</h4> */}
                <div className={style.button_container}>
                    {/* <button
                        type="submit"
                        className={style.iconSave}
                        datatooltip="Uložiť"
                        // disabled={!step ? true : false}
                        // onClick={handleSave}
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} />
                    </button>
                    <div
                        className={style.iconCancel}
                        onClick={closeModal}
                        datatooltip="Zavrieť"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </div> */}
                    <button
                        type="button"
                        className={`${style.button} ${style.cancel}`}
                        onClick={closeModal}
                    >
                        Zrušiť
                    </button>
                    <button
                        type="submit"
                        className={`${style.button} ${style.save}`}
                    >
                        Uložiť
                    </button>
                </div>
            </form>
        </div>
    );
}
