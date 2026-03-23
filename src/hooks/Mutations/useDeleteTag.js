import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createDeleteTag } from '../use-post';

export const useDeleteTag = (axiosPrivate) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (step) => createDeleteTag(axiosPrivate, step),
        onError: (error) => {
            console.error('Error Delete Tag :', error);
        },
        onSuccess: (response, deletedTag) => {
            queryClient.invalidateQueries(['foodTags']);
        },
    });
};
