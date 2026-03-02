import { getDataPrivateID } from '../use-get';
import { useQuery } from '@tanstack/react-query';

export const useFood = (ID, axiosPrivate, isSaving) => {
    return useQuery({
        queryKey: ['foods', ID],
        queryFn: (queryKey) =>
            getDataPrivateID(axiosPrivate, queryKey.queryKey),
        enabled: !isSaving,
    });
};
