import style from '../assets/styles/layouts/AdminLayout.module.css';
import Users from './Users';

export default function Admin() {
    return (
        <main className={style.layout}>
            <Users />
        </main>
    );
}
