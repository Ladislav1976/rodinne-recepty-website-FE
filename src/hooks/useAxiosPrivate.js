import { axiosPrivate } from '../api/axios';
import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';

export default function useAxiosPrivate(props) {
    const refresh = useRefreshToken();
    const { auth, csrftoken } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.access_token}`;
                    config.headers['X-CSRFToken'] = csrftoken;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest.sent) {
                    prevRequest.sent = true;

                    const refreshResult = await refresh();
                    if (!refreshResult) {
                        return Promise.reject(error);
                    }

                    const { csrfToken: newCSRFToken, accessToken: newAccessToken } = refreshResult;
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    prevRequest.headers['X-CSRFToken'] = newCSRFToken;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth, refresh, csrftoken]);
    return axiosPrivate;
}
