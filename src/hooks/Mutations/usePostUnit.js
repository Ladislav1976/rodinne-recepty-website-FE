import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPostUnit } from '../use-post';

export const usePostUnit = (axiosPrivate) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (unit) => createPostUnit(axiosPrivate, unit),
        onMutate: async (newUnit) => {
            const queryKey = ['unit'];
            await queryClient.cancelQueries({ queryKey });
            const previousUnits = queryClient.getQueryData(queryKey);
            const tempId = `temp-${Date.now()}`;
            const newUnitWithId = {
                ...newUnit,
                id: tempId,
            };
            queryClient.setQueryData(queryKey, (old) => {
                const currentUnits = Array.isArray(old) ? old : [];
                return [...currentUnits, newUnitWithId];
            });
            return { tempId, previousUnits, queryKey };
        },
        onError: (err, newUnit, context) => {
            console.error('Error Post Unit :', err);
            if (context?.previousUnits) {
                queryClient.setQueryData(
                    context.queryKey,
                    context.previousUnits,
                );
            } else {
                queryClient.setQueryData(context.queryKey, (old) => {
                    return Array.isArray(old)
                        ? old.filter((u) => u.id !== context.tempId)
                        : [];
                });
            }
        },
        onSettled: (data, error, newUrl, context) => {
            if (data?.data) {
                queryClient.setQueryData(context.queryKey, (old) => {
                    if (!Array.isArray(old)) return [data.data];
                    return old.map((unit) =>
                        unit.id === context.tempId ? data.data : unit,
                    );
                });
            }
            queryClient.invalidateQueries(context.queryKey);
        },
    });
};
