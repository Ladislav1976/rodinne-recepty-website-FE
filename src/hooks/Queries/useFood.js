import { getDataPrivateID } from '../use-get';
import { useQuery } from '@tanstack/react-query';

export const useFood = (ID, axiosPrivate, isSaving, params) => {
    return useQuery({
        queryKey: ['foods', ID, params.toString()],
        queryFn: (queryKey) => getDataPrivateID(axiosPrivate, queryKey.queryKey, params),
        enabled: !isSaving,
    });
};
