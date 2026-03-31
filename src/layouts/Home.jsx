import style from '../assets/styles/layouts/FoodsLayout.module.css';
import { Outlet } from 'react-router-dom';

export function Home() {
    return (
        <div className={style.layout}>
            <div className={style.banner}>
                <div className={style.container}>
                    <span>HOME</span>
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default Home;
