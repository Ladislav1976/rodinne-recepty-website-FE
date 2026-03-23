import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createPostTagGroup } from '../use-post';

export const usePostTagGroup = (axiosPrivate) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (groupName) => createPostTagGroup(axiosPrivate, groupName),
        onMutate: async (newTag) => {
            const queryKey = ['tagGroups'];
            await queryClient.cancelQueries({ queryKey });
            const previousTags = queryClient.getQueryData(queryKey);
            const tempId = `temp-${Date.now()}`;
            const newTagsWithId = {
                ...newTag,
                id: tempId,
            };
            queryClient.setQueryData(queryKey, (old) => {
                const currentTags = Array.isArray(old) ? old : [];
                return [...currentTags, newTagsWithId];
            });
            return { tempId, previousTags, queryKey };
        },

        onError: (err, newTag, context) => {
            console.error('Error Post tagGroup :', err);
            if (context?.previousTags) {
                queryClient.setQueryData(
                    context.queryKey,
                    context.previousTags,
                );
            } else {
                queryClient.setQueryData(context.queryKey, (old) => {
                    return Array.isArray(old)
                        ? old.filter((u) => u.id !== context.tempId)
                        : [];
                });
            }
        },
        onSettled: (data, error, newTag, context) => {
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
