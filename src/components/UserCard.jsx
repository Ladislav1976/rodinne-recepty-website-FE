import { useRef, useState, useEffect } from 'react';
import style from '../assets/styles/Components/UserCard.module.css';
import { usePutUser } from '../hooks/Mutations/usePutUser';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import default_image from '../image/user_image.png';
export default function UserCard({ userCard, closeModal }) {
    const [role, setRole] = useState(userCard.role || 'User_readOnly');
    const [roleDefault, setRoleDefault] = useState('');
    const [statusDefault, setStatusDefault] = useState('');
    const [status, setStatus] = useState(userCard.is_active);
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();
    const controller = new AbortController();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        errRef.current.focus();
    }, []);

    const putUser = usePutUser({
        setRole: setRole,
        setStatus: setStatus,
        roleDefault: roleDefault,
        setRoleDefault: setRoleDefault,
        statusDefault: statusDefault,
        setStatusDefault: setStatusDefault,
        setImageContainer: null,
        setImageDefault: null,
        imageDefault: null,
        handlerSetError: handlerSetError,
        axiosPrivate,
        controller,
        closeModal,
    });

    function handleUpdateRole(newRole) {
        if (!roleDefault) {
            if (role !== 'Admin') {
                setRoleDefault(role);
                setRole(newRole);
            }
        } else {
            if (role !== 'Admin') {
                setRole(newRole);
            }
        }
    }

    function handleUpdateStatus(e) {
        if (!statusDefault) {
            setStatusDefault(status);
            setStatus(e.target.checked ? true : false);
        } else {
            setStatus(e.target.checked ? true : false);
        }
    }

    function handlerSetError(message) {
        setErrMsg(message);
        setTimeout(() => {
            setErrMsg('');
        }, 3000);
    }

    function handlePostRole() {
        const formdataPut = {
            id: userCard.id,
            userForm: {
                id: userCard.id,
                email: userCard.email,
                role: role,
                is_active: status,
            },
        };
        if (roleDefault || statusDefault !== '') {
            putUser.mutate(formdataPut);
        }
    }

    return (
        <div className={style.main} key={userCard.id}>
            <h4>Základné údaje</h4>
            <form className={style.form}>
                <div className={style.user_info}>
                    <div className={style.user_photo}>
                        <img
                            src={userCard.avatar || default_image}
                            loading="eager"
                            fetchPriority="high"
                            alt="Profilová fotka"
                        />
                        <p
                            ref={errRef}
                            className={errMsg ? style.errmsg : style.hiden}
                            aria-live="assertive"
                        >
                            {errMsg}
                        </p>
                    </div>
                    <div className={style.user_details}>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Meno</th>
                                    <td>{userCard.first_name}</td>
                                </tr>
                                <tr>
                                    <th>Priezvisko</th>
                                    <td>{userCard.last_name}</td>
                                </tr>
                                <tr>
                                    <th>E-mail</th>
                                    <td>{userCard.email}</td>
                                </tr>
                                <tr>
                                    <th>Receptov</th>
                                    <td>{userCard.foods_count}</td>
                                </tr>
                                <tr>
                                    <th> Stav účtu</th>
                                    <td>
                                        {
                                            <div
                                                className={
                                                    style.status_container
                                                }
                                            >
                                                <label className={style.switch}>
                                                    <input
                                                        type="checkbox"
                                                        aria-label={
                                                            status === true
                                                                ? 'Aktívny'
                                                                : 'Neaktívny'
                                                        }
                                                        checked={
                                                            status === true
                                                        }
                                                        disabled={
                                                            role === 'Admin'
                                                        }
                                                        onChange={(e) =>
                                                            handleUpdateStatus(
                                                                e,
                                                            )
                                                        }
                                                    />
                                                    <span
                                                        className={style.slider}
                                                        style={{
                                                            cursor:
                                                                role === 'Admin'
                                                                    ? 'context-menu'
                                                                    : 'pointer',
                                                        }}
                                                    ></span>
                                                </label>
                                                <span
                                                    className={
                                                        style.status_text
                                                    }
                                                    style={{
                                                        color:
                                                            status === true
                                                                ? 'rgb(1, 168, 1)'
                                                                : '#999',
                                                    }}
                                                >
                                                    {status === true
                                                        ? 'Aktívny'
                                                        : 'Neaktívny'}
                                                </span>
                                            </div>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th rowSpan={4}>Profil:</th>

                                    {[
                                        {
                                            role: 'Admin',
                                            viewRole: 'Admin',
                                        },
                                        {
                                            role: 'User_readOnly',
                                            viewRole: 'Read',
                                        },
                                        {
                                            role: 'User_edit',
                                            viewRole: 'Self Edit',
                                        },
                                        {
                                            role: 'Editor',
                                            viewRole: 'Edit',
                                        },
                                    ].map((r) => (
                                        <tr key={r.role}>
                                            <th>{r.viewRole}</th>
                                            <td>
                                                {
                                                    <div
                                                        className={
                                                            style.status_container
                                                        }
                                                    >
                                                        <label
                                                            className={
                                                                style.switch
                                                            }
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                aria-label={
                                                                    role ===
                                                                    r.role
                                                                        ? 'Aktívny'
                                                                        : 'Neaktívny'
                                                                }
                                                                checked={
                                                                    role ===
                                                                    r.role
                                                                }
                                                                disabled={
                                                                    r.role ===
                                                                    'Admin'
                                                                }
                                                                onChange={() =>
                                                                    handleUpdateRole(
                                                                        r.role,
                                                                    )
                                                                }
                                                            />
                                                            <span
                                                                className={
                                                                    style.slider
                                                                }
                                                                disabled={
                                                                    r.role ===
                                                                    'Admin'
                                                                }
                                                                style={{
                                                                    cursor:
                                                                        role ===
                                                                        'Admin'
                                                                            ? 'context-menu'
                                                                            : 'pointer',

                                                                    backgroundColor:
                                                                        role ===
                                                                        r.role
                                                                            ? role ===
                                                                              'Admin'
                                                                                ? 'rgba(1, 168, 1, 0.36)'
                                                                                : 'rgb(1, 168, 1)'
                                                                            : '#999' &&
                                                                                r.role ===
                                                                                    'Admin'
                                                                              ? '#99999933'
                                                                              : '#999',
                                                                }}
                                                            ></span>
                                                        </label>
                                                        <span
                                                            className={
                                                                style.status_text
                                                            }
                                                            style={{
                                                                color:
                                                                    role ===
                                                                    r.role
                                                                        ? role ===
                                                                          'Admin'
                                                                            ? 'rgba(1, 168, 1, 0.36)'
                                                                            : 'rgb(1, 168, 1)'
                                                                        : '#999' &&
                                                                            r.role ===
                                                                                'Admin'
                                                                          ? '#99999933'
                                                                          : '#999',
                                                            }}
                                                        >
                                                            {role === r.role
                                                                ? 'Aktívny'
                                                                : 'Neaktívny'}
                                                        </span>
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={style.button_container}>
                    <button
                        type="button"
                        className={`${style.button} ${style.cancel}`}
                        onClick={closeModal}
                    >
                        Zrušiť
                    </button>
                    <button
                        type="submit"
                        className={`${style.button} ${style.save}`}
                        onClick={handlePostRole}
                    >
                        Uložiť
                    </button>
                </div>
            </form>
        </div>
    );
}
