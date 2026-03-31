import { Outlet } from 'react-router-dom';
import image from '../image/adminphoto.jpg';
import style from '../assets/styles/layouts/AdminLayout.module.css';
const AdminLayout = () => {
    return (
        <div className={style.layout}>
            <div className={style.banner}>
                <div className={style.container}>
                    <span>Admin</span>
                    <img className={style.image} loading="lazy" src={image} alt="" />
                </div>
            </div>

            <Outlet />
        </div>
    );
};

export default AdminLayout;
