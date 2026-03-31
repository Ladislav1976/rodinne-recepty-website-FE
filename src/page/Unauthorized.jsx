import { useNavigate } from 'react-router-dom';
import style from '../assets/styles/pages/Unauthorized.module.css';

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div className={style.main}>
            <h1>Prístup zamietnuty</h1>
            <br />
            <p>Nemáte povolený prístup na editovanie stránky.</p>

            <button className={style.button} onClick={goBack}>
                Späť
            </button>
        </div>
    );
};

export default Unauthorized;
