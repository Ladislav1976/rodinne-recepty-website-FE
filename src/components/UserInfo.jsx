import useAuth from '../hooks/useAuth';
import style from '../assets/styles/Components/UserInfo.module.css';
import user_image from '../image/user_image.png';
import { useState, useEffect } from 'react';

import UserProfile from './UserProfile';

import ModalProfile from '../modals/ModalProfile';

export default function UserInfo(props) {
    const { auth } = useAuth();

    const [imagePreview, setImagePreview] = useState('');
    const [modalUserProfileFlag, setModalUserProfileFlag] = useState(false);

    function closeModal(e) {
        setModalUserProfileFlag(false);
    }

    useEffect(() => {
        const avatar = auth?.userRes?.avatar;
        if (!avatar) {
            setImagePreview('');
            return;
        }
        setImagePreview(avatar);
    }, [auth]);

    return (
        <>
            <div
                className={style.containerUser}
                onClick={() => setModalUserProfileFlag(true)}
            >
                <img
                    className={style.imgage}
                    src={imagePreview || user_image}
                    alt="usder_image"
                />
                <div className={style.name}>{auth?.userRes?.first_name}</div>
                <div className={style.name}>{auth?.userRes?.last_name}</div>
                <ModalProfile
                    visible={modalUserProfileFlag}
                    setModalFlag={setModalUserProfileFlag}
                >
                    <UserProfile
                        userCard={auth?.userRes}
                        imagePreview={imagePreview}
                        closeModal={closeModal}
                        setModalUserProfileFlag={setModalUserProfileFlag}
                    ></UserProfile>
                </ModalProfile>
            </div>
        </>
    );
}
