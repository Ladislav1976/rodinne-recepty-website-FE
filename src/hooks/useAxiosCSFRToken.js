import { axiosPrivate as axiosCSFRToken } from '../api/axios';
import { useEffect } from 'react';
import useRefreshCSFRToken from './useRefreshCSFRToken';
import useAuth from './useAuth';

export default function useAxiosCSFRToken(props) {
    const refresh = useRefreshCSFRToken();
    const { auth, csrftoken } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosCSFRToken.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['X-CSRFToken'] = csrftoken;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
        const responseIntercept = axiosCSFRToken.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest.sent) {
                    prevRequest.sent = true;
                    const { csrfToken: newCSRFToken } = await refresh();

                    prevRequest.headers['X-CSRFToken'] = newCSRFToken;

                    return axiosCSFRToken(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosCSFRToken.interceptors.request.eject(requestIntercept);
            axiosCSFRToken.interceptors.response.eject(responseIntercept);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth, refresh]);
    return axiosCSFRToken;
}
