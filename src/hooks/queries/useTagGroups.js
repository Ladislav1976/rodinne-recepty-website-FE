import { getDataPrivate } from '../use-get';
import { useQuery } from '@tanstack/react-query';
export const useTagGroups = (axiosPrivate) => {
    return useQuery({
        queryKey: ['tagGroups'],
        queryFn: (queryKey) => getDataPrivate(axiosPrivate, queryKey.queryKey),
        enabled: !!axiosPrivate,
        placeholderData: (previousData) => previousData,
    });
};
