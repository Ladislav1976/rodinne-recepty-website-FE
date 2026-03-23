import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createPostFoodTag } from '../use-post';

export const usePostTag = (axiosPrivate) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (foodTag) => createPostFoodTag(axiosPrivate, foodTag),
        onMutate: async (newFoodTag) => {
            const queryKey = ['foodTags'];
            await queryClient.cancelQueries({ queryKey });
            const previousFoodTags = queryClient.getQueryData(queryKey);
            const tempId = `temp-${Date.now()}`;
            const newFoodTagWithId = {
                ...newFoodTag,
                id: tempId,
            };
            queryClient.setQueryData(queryKey, (old) => {
                const currentFoodTags = Array.isArray(old) ? old : [];
                return [...currentFoodTags, newFoodTagWithId];
            });
            return { tempId, previousFoodTags, queryKey };
        },
        onError: (err, newUnit, context) => {
            console.error('Error Post FoodTag :', err);
            if (context?.previousFoodTags) {
                queryClient.setQueryData(
                    context.queryKey,
                    context.previousFoodTags,
                );
            } else {
                queryClient.setQueryData(context.queryKey, (old) => {
                    return Array.isArray(old)
                        ? old.filter((u) => u.id !== context.tempId)
                        : [];
                });
            }
        },
        onSettled: (data, error, newFoodTag, context) => {
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
