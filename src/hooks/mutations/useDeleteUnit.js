import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createDeleteUnit } from '../use-post';

export const useDeleteUnit = (axiosPrivate) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (step) => createDeleteUnit(axiosPrivate, step),
        onError: (error) => {
            console.error('Error Delete Unit :', error);
        },
        onSuccess: (response, deletedUnit) => {
            queryClient.invalidateQueries(['unit']);
        },
    });
};
