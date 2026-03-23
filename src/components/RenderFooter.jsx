import useAuth from '../hooks/useAuth';
import style from '../assets/styles/Components/Footer.module.css';

export default function RenderFooter(props) {
    const { auth } = useAuth();

    return (
        <>
            {auth.userRes && (
                <div className={style.lContainer}>
                    © {new Date().getFullYear()} Ladislav Filka
                </div>
            )}
        </>
    );
}
