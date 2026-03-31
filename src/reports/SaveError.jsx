import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import style from '../assets/styles/reports/Save.module.css';

export default function SaveError(props) {
    return (
        <>
            <div className={style.box}>
                <div className={style.icon}>
                    <FontAwesomeIcon
                        className={style.errorIcon}
                        icon={faCircleExclamation}
                        id="inpFileIcon"
                    />
                </div>
                <h3>Chyba pri ukladani!</h3>
            </div>
        </>
    );
}
