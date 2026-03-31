import { NavLink } from 'react-router-dom';
import style from '../assets/styles/components/RightPanelAdmin.module.css';
import { createPortal } from 'react-dom';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function RightPanelAdmin(props) {
    const [toggle, setToggle] = props.toggle;
    const sidebarContent = (
        <>
            <div
                className={`${style.sidebarAdmin} ${toggle ? style.isActive : ''}`}
                onClick={(e) => {
                    if (toggle && e.target === e.currentTarget) {
                        setToggle(!toggle);
                    }
                }}
            >
                {' '}
                <div
                    className={style.cancelButton}
                    onClick={() => {
                        if (toggle) {
                            setToggle(!toggle);
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                <div className={style.container}>
                    <div className={style.li}>
                        <NavLink to="/admin/setting">Nastavenia</NavLink>
                    </div>
                    <div className={style.li}>
                        <NavLink className={style.li} to="/admin/users">
                            Užívatelia
                        </NavLink>
                    </div>
                    <div className={style.li}>
                        <NavLink className={style.li} to="/admin/register">
                            Nový účet
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    );
    return createPortal(sidebarContent, document.body);
}
