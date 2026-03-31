import { useQueries } from '@tanstack/react-query';
import { getDataPrivate, getDataPrivateID } from '../use-get';

export const useQueriesItems = (ID, axiosPrivate) => {
    return useQueries({
        queries: [
            {
                queryKey: ['users'],
                queryFn: (queryKey) => getDataPrivate(axiosPrivate, queryKey.queryKey),
                placeholderData: (previousData) => previousData,
            },

            {
                queryKey: ['foods', ID],
                enabled: !!ID,

                queryFn: (queryKey) => getDataPrivateID(axiosPrivate, queryKey.queryKey),
                placeholderData: (previousData) => previousData,
            },
            {
                queryKey: ['ingredient'],
                queryFn: (queryKey) => getDataPrivate(axiosPrivate, queryKey.queryKey),

                placeholderData: (previousData) => previousData,
            },

            {
                queryKey: ['unit'],
                queryFn: (queryKey) => getDataPrivate(axiosPrivate, queryKey.queryKey),
                placeholderData: (previousData) => previousData,
            },

            {
                queryKey: ['foodTags'],
                queryFn: (queryKey) => getDataPrivate(axiosPrivate, queryKey.queryKey),

                placeholderData: (previousData) => previousData,
            },
        ],
        combine: (results) => {
            return {
                data: {
                    usersQf: results[0].data,
                    foodQf: results[1].data,
                    ingredientQf: results[2].data,
                    unitsQf: results[3].data,
                    tagsQf: results[4].data,
                },

                isLoading: results.some((r) => r.isLoading),
                isError: results.some((r) => r.isError),
            };
        },
    });
};
