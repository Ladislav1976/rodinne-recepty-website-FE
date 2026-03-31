import { useQuery } from '@tanstack/react-query';
import { getDataPrivateParams } from '../use-get';

export const useFoods = (axiosPrivate, paramsFoodView) => {
    return useQuery({
        queryKey: ['foodsList', paramsFoodView.toString()],
        queryFn: (queryKey) =>
            getDataPrivateParams(axiosPrivate, queryKey.queryKey, paramsFoodView),

        staleTime: 10 * (60 * 1000),
        gcTime: 15 * (60 * 1000),
        refetchOnMount: true,
        placeholderData: (previousData) => previousData,
    });
};
