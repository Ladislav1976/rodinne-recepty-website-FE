import style from '../assets/styles/components/MenuToggle.module.css';

export default function MenuToggle(props) {
    const [toggle, setToggle] = props.toggle;
    return (
        <div
            className={`${style.menutoggle} ${toggle ? style.isactive : ''}`}
            onClick={() => setToggle(!toggle)}
        >
            <div className={style.hamburger}>
                <span></span>
            </div>
        </div>
    );
}
