import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPutUnits } from '../use-post';

export const usePutUnits = (axiosPrivate, controller) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (units) => createPutUnits(axiosPrivate, units),
        onMutate: async (updatedUnit) => {
            const queryKey = ['unit'];
            await queryClient.cancelQueries({ queryKey });
            const previousUnits = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old) => {
                if (!Array.isArray(old)) return [];
                return old.map((u) =>
                    u.id === updatedUnit.id ? { ...u, ...updatedUnit } : u,
                );
            });
            return { previousUnits, queryKey };
        },
        onError: (err, previousUnits, context) => {
            console.error('Error Put Unit:', err);
            // throw err;
            if (context?.queryKey) {
                if (context?.previousUnits != null) {
                    queryClient.setQueryData(
                        context.queryKey,
                        context.previousUnits,
                    );
                } else {
                    queryClient.removeQueries({ queryKey: context.queryKey });
                }
            }
        },
        onSettled: (data, error, ImagefoodUnit, context) => {
            queryClient.invalidateQueries({
                queryKey: context?.queryKey || ['unit'],
            });
        },
    });
};
