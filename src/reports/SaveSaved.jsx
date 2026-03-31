import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import style from '../assets/styles/reports/Save.module.css';

export default function SaveSaved(props) {
    return (
        <>
            <div></div>
            <div className={style.box}>
                <div className={style.icon}>
                    <FontAwesomeIcon className={style.saveIcon} icon={faCheck} id="inpFileIcon" />
                </div>
            </div>
        </>
    );
}
