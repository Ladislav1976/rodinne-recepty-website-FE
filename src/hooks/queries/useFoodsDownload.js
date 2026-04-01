import { useQueryClient } from '@tanstack/react-query';
import { useFoods } from './useFoods';
import { useEffect, useMemo } from 'react';
import { getDataPrivateID } from '../use-get';

export const useFoodsDownload = (axiosPrivate, paramsFoodView, auth) => {
    const foodsQf = useFoods(axiosPrivate, paramsFoodView);
    const is_deleted = paramsFoodView.get('is_deleted');
    const filteredParams = new URLSearchParams();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (is_deleted !== null) {
            filteredParams.append('is_deleted', is_deleted);
        }
        (foodsQf?.data?.results || []).forEach((food) => {
            queryClient.prefetchQuery({
                queryKey: ['foods', food.id, filteredParams.toString()],
                queryFn: (queryKey) =>
                    getDataPrivateID(axiosPrivate, queryKey.queryKey, filteredParams),
                staleTime: 10 * 60 * 1000,
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [foodsQf.data?.results, filteredParams.toString()]);

    const isLoading = foodsQf.isLoading;
    const isFetching = foodsQf.isFetching;
    const isError = foodsQf.isError;
    const isSuccess = foodsQf.isSuccess;

    const memoizedData = useMemo(() => {
        if (!foodsQf.data) return null;

        const filteredResults =
            is_deleted === 'true'
                ? (foodsQf?.data?.results || []).filter((food) => {
                      const isOwner = food.user?.id === auth?.userRes?.id;
                      const isAdmin = auth?.userRes?.role === 'Editor';
                      return isOwner || isAdmin;
                  })
                : foodsQf.data.results;

        return {
            ...foodsQf.data,
            results: filteredResults,
            tagsQf: foodsQf.data.tagsQf || [],
            usersQf: foodsQf.data.usersQf || [],
            tagGroupQf: foodsQf.data.tagGroupQf || [],
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, foodsQf.data, is_deleted, auth?.userRes?.id, auth?.userRes?.role]);

    return {
        data: memoizedData,
        isLoading,
        isSuccess,
        isError,
        isFetching,
    };
};
