import UserInfo from './UserInfo';
import useAuth from '../hooks/useAuth';
import style from '../assets/styles/components/Header.module.css';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import receptyLogo from '../image/rodinneReceptyLogoCutted.png';

import {
    faPeopleRoof,
    faHouse,
    faUtensils,
    faGear,
    faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

import useLogout from '../hooks/useLogout';
import MenuToggle from './MenuToggle';
import RightPanelAdmin from './RightPanelAdmin';

export default function RenderHeader(props) {
    const { auth, page, pageSize, ordering, search, is_deleted } = useAuth();
    const [toggle, setToggle] = props.toggle;
    const errRef = useRef();

    let setErrMsg = props.setErrMsg;
    const logOut = useLogout(errRef, handlerSetErrMessage);

    function handlerSetErrMessage(message) {
        setErrMsg(message);
        setTimeout(() => {
            setErrMsg('');
        }, 5000);
    }
    const params = new URLSearchParams({
        ordering: ordering,
        page: page,
        page_size: pageSize,
        search: search,
        is_deleted: is_deleted,
    });
    const navigate = useNavigate();
    const nav = `/recepty?${params.toString()}`;

    return (
        <>
            {auth.userRes ? (
                <div className={style.lContainer}>
                    <div className={style.lHeader}>
                        <div className={style.receptyLogoContainer}>
                            <div className={style.receptyLogo} onClick={() => navigate(`/`)}>
                                <img src={receptyLogo} alt="" />
                            </div>
                        </div>
                        <div className={style.menu}>
                            <div className={style.logo} onClick={() => navigate(`/`)}>
                                <FontAwesomeIcon icon={faHouse} />
                            </div>
                            <div className={style.logo} onClick={() => navigate(nav)}>
                                <FontAwesomeIcon icon={faUtensils} />
                            </div>{' '}
                            {auth?.userRes?.is_superuser && (
                                <>
                                    <MenuToggle toggle={[toggle, setToggle]} />
                                    <RightPanelAdmin toggle={[toggle, setToggle]} />
                                    <div className={style.dropdown}>
                                        <div className={`${style.logo} ${style.dropbtn}`}>
                                            <FontAwesomeIcon icon={faGear} />
                                        </div>

                                        <div className={style.dropdowncontent}>
                                            <NavLink className={style.li} to="/admin/setting">
                                                Nastavenia
                                            </NavLink>
                                            <NavLink className={style.li} to="/admin/users">
                                                Užívatelia
                                            </NavLink>
                                            <NavLink className={style.li} to="/admin/register">
                                                Nový účet
                                            </NavLink>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className={style.logo} onClick={() => logOut()}>
                                <FontAwesomeIcon icon={faRightFromBracket} />
                            </div>
                        </div>

                        <div className={style.userBox}>
                            <UserInfo />
                        </div>
                    </div>
                </div>
            ) : (
                <div className={style.lContainer}>
                    <div className={style.lHeader}>
                        <div className={style.familyContainer}>
                            <div className={style.familyLogo}>
                                {' '}
                                <FontAwesomeIcon icon={faPeopleRoof} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
