import { createDeleteFood } from '../use-post';
import { useQueryClient, useMutation } from '@tanstack/react-query';

export const useDeleteFood = (axiosPrivate, setModalLoadingFlag) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (food) => createDeleteFood(axiosPrivate, food),
        onError: (error) => {
            console.log('Error Delete Food :', error);
            setModalLoadingFlag(false);
        },
        onSuccess: (response, foodDeleted) => {
            console.log('Food :', foodDeleted, 'sucsesfully deleted!');
            queryClient.removeQueries({
                queryKey: ['foods', foodDeleted.id],
            });
            queryClient.invalidateQueries({
                queryKey: ['foodsList'],
            });
            queryClient.invalidateQueries({
                queryKey: ['foods', foodDeleted.id],
            });
        },
    });
};
