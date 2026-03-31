import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RequireAuthUserEdit = ({ allowedRoles }) => {
    const { auth, usercont } = useAuth();

    const location = useLocation();
    return !allowedRoles?.includes(auth?.userRes?.role) ? (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : auth?.userRes?.role === 'User_edit' && usercont[0].id !== auth?.userRes?.id ? (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : (
        <Outlet />
    );
};

export default RequireAuthUserEdit;
