import { getDataPrivate } from '../use-get';
import { useQuery } from '@tanstack/react-query';
export const useTags = (axiosPrivate) => {
    return useQuery({
        queryKey: ['foodTags'],
        queryFn: (queryKey) => getDataPrivate(axiosPrivate, queryKey.queryKey),
        placeholderData: (previousData) => previousData,
    });
};
