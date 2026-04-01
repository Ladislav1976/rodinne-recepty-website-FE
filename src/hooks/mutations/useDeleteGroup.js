import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createDeleteGroup } from '../use-post';

export const useDeleteGroup = (axiosPrivate) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (step) => createDeleteGroup(axiosPrivate, step),
        onError: (error) => {
            console.error('Error Delete Group :', error);
        },
        onSuccess: (response, deletedTag) => {
            queryClient.invalidateQueries(['tagGroups']);
        },
    });
};
