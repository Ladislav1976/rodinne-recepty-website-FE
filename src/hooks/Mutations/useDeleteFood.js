import { createDeleteFood } from '../use-post';
import { useQueryClient, useMutation } from '@tanstack/react-query';

export const useDeleteFood = (axiosPrivate, setModalLoadingFlag, is_deleted) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (food) => createDeleteFood(axiosPrivate, food),
        onError: (error) => {
            console.error('Error Delete Food :', error);
            setModalLoadingFlag(false);
        },
        onSuccess: (response, foodDeleted) => {
            queryClient.removeQueries({
                queryKey: ['foods', foodDeleted.id, is_deleted],
                exact: true,
            });
            queryClient.invalidateQueries({
                queryKey: ['foodsList'],
            });
        },
    });
};
