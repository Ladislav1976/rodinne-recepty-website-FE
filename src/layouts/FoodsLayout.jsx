import { Outlet } from 'react-router-dom';
import style from '../assets/styles/layouts/FoodsLayout.module.css';
import image from '../image/banner.png';
import receptyLogo from '../image/rodinneReceptyLogoCutted.png';
const FoodsLayout = () => {
    return (
        <div className={style.layout}>
            <div className={style.banner}>
                <div className={style.container}>
                    {' '}
                    <div className={style.receptyLogo}>
                        <img src={receptyLogo} alt="" />
                    </div>
                    <span>Rodinné recepty</span>
                    <img className={style.image} loading="lazy" src={image} alt="" />
                </div>
            </div>

            <Outlet />
        </div>
    );
};

export default FoodsLayout;
