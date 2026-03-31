import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import style from '../assets/styles/reports/Save.module.css';

export default function SaveLoading(props) {
    return (
        <>
            <div className={style.loadingIcon}>
                <FontAwesomeIcon
                    className={style.loadingIcon}
                    icon={faSpinner}
                    id="inpFileIcon"
                    spin
                />
            </div>
        </>
    );
}
