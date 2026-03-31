import axios from '../api/axios';
import useAuth from './useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function useRefreshToken() {
    const { setAuth, setCSRFToken, setPage, setPageSize, setOrdering } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const refresh = async () => {
        try {
            const response = await axios.post('api/token/refresh/', {});
            setAuth((prev) => {
                return {
                    ...prev,
                    access_token: response?.data?.access?.access,
                    userRes: response?.data?.user,
                };
            });
            setCSRFToken(response?.headers['x-csrftoken']);
            setPage(1);
            setPageSize(20);
            setOrdering('date');

            return {
                accessToken: response.data.access.access,
                csrfToken: response.headers['x-csrftoken'],
            };
        } catch (err) {
            if (err?.response?.status === 401) {
                navigate('/login', {
                    state: { from: location },
                    replace: true,
                });
            }
        }
    };

    return refresh;
}
