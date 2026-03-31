import qs from 'qs';

export async function getDataPrivate(axiosPrivate, queryKey) {
    let isMounted = true;
    const controller = new AbortController();
    const res = await axiosPrivate
        .get(`${queryKey}/`, {
            signal: controller.signal,
        })
        .then((res) => res.data);
    // eslint-disable-next-line no-unused-vars
    isMounted = false;
    controller.abort();
    return await res;
}

export async function getDataPrivateID(axiosPrivate, queryKey, param) {
    const searchParams = param instanceof URLSearchParams ? Object.fromEntries(param) : param;

    const res = await axiosPrivate
        .get(`${queryKey[0]}/${queryKey[1]}/`, {
            params: searchParams,
        })
        .then((res) => res.data);

    return await res;
}

export async function getDataPrivateParams(axiosPrivate, queryKey, param) {
    const searchParams = param instanceof URLSearchParams ? Object.fromEntries(param) : param;
    const res = await axiosPrivate
        .get(`${queryKey[0]}/`, {
            params: searchParams,
            paramsSerializer: (params) => {
                return qs.stringify(params, { arrayFormat: 'repeat' });
            },
        })
        .then((res) => res.data);

    return await res;
}
