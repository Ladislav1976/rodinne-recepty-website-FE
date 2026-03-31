import style from '../assets/styles/Components/TopDropDown.module.css';

export default function TopDropDown(props) {
    return (
        <>
            <div
                className={`${style.sidebar} ${props.toggle ? style.isactive : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <h3>Menu</h3>

                <nav className={style.menu}>
                    <a href="/" className={`${style.menuItem} ${style.isActive}`}>
                        HOME
                    </a>
                    <a href={props.nav} className={style.menuItem}>
                        RECEPTY
                    </a>
                    <div onClick={props.logOut} className={style.menuItem}>
                        ODHLÁSIŤ
                    </div>
                </nav>
            </div>
        </>
    );
}
