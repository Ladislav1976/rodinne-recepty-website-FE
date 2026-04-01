import { getDataPrivate } from '../use-get';
import { useQuery } from '@tanstack/react-query';

export const useUsers = (axiosPrivate) => {
    return useQuery({
        queryKey: ['users'],
        queryFn: (queryKey) => getDataPrivate(axiosPrivate, queryKey.queryKey[0]),
        placeholderData: (previousData) => previousData,
        select: (a) =>
            a.sort(function (a, b) {
                return a.id - b.id;
            }),
    });
};
