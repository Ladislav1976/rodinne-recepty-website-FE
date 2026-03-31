/* eslint-disable no-unused-vars */
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Foods from './page/Foods';
import FoodsLayout from './layouts/FoodsLayout';
import AdminLayout from './layouts/AdminLayout';
import NewFood from './page/NewFood';
import EditFood from './page/EditFood';
import ViewFood from './page/ViewFood';
import SubmitFood from './page/SubmitFood';
import Reset from './page/Reset';
import ResetPassword from './page/Resetpassword';
import Home from './layouts/Home';
import NotFound from './components/NotFound';
import RequireAuth from './components/RequireAuth';
import RequireAuthUserEdit from './components/RequireAuthUserEdit';
import PersistLogin from './page/PersistLogin';
import Layout from './layouts/Layout';
import PersistLayout from './layouts/PersistLayout';
import RegisterNewAccount from './page/Registernewaccount';
import Login from './page/Login';
import Unauthorized from './page/Unauthorized';
import Admin from './page/Admin';
import Setting from './page/Setting';
import { useState } from 'react';

function App() {
    const ROLES = {
        User_edit: 'User_edit',
        Editor: 'Editor',
        Admin: 'Admin',
        User_readOnly: 'User_readOnly',
        Superuser: true,
    };

    const [errMsg, setErrMsg] = useState('');

    return (
        <>
            {/* Un-Protected  */}
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="login" element={<Login />} />

                    <Route path="unauthorized" element={<Unauthorized />} />
                    <Route path="reset" element={<Reset />} />
                    <Route path="reset_password/:token/" element={<ResetPassword />} />

                    {/* Protected  */}
                    <Route element={<PersistLogin />}>
                        <Route element={<PersistLayout setErrMsg={setErrMsg} />}>
                            <Route
                                element={
                                    <RequireAuth
                                        allowedRoles={[
                                            ROLES.User_edit,
                                            ROLES.User_readOnly,
                                            ROLES.Editor,
                                            ROLES.Admin,
                                        ]}
                                    />
                                }
                            >
                                <Route path="/" element={<Home />}></Route>
                                <Route path="/recepty" element={<FoodsLayout />}>
                                    <Route index element={<Foods />}></Route>
                                    <Route
                                        path=":id/"
                                        element={<ViewFood errMsg={errMsg} />}
                                    ></Route>
                                    <Route
                                        path=":id/email"
                                        element={<SubmitFood errMsg={errMsg} />}
                                    ></Route>
                                    <Route
                                        path="novy_recept/"
                                        element={<NewFood errMsg={errMsg} />}
                                    ></Route>
                                    <Route path="search/:search/" element={<Foods />}></Route>
                                    <Route
                                        element={
                                            <RequireAuthUserEdit
                                                allowedRoles={[
                                                    ROLES.User_edit,
                                                    ROLES.Editor,
                                                    ROLES.Admin,
                                                ]}
                                            />
                                        }
                                    >
                                        <Route
                                            path="/recepty/:id/edit"
                                            element={<EditFood errMsg={[errMsg, setErrMsg]} />}
                                        ></Route>
                                    </Route>
                                </Route>
                            </Route>
                            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                                <Route path="/admin" element={<AdminLayout />}>
                                    <Route path="setting" element={<Setting />} />
                                    <Route path="users" element={<Admin />} />
                                    <Route path="register" element={<RegisterNewAccount />} />
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFound />}></Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
