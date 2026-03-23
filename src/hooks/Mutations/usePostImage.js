import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createPostImagefood } from '../use-post';

export const usePostImage = (axiosPrivate) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData) =>
            createPostImagefood(axiosPrivate, formData.imageFormForBackEnd),

        onMutate: async (newImageObj) => {
            const newImage = newImageObj.formdataForRCatch;
            const queryKey = ['imagefood', newImage.food];
            await queryClient.cancelQueries({ queryKey });
            const previousImages = queryClient.getQueryData(queryKey);
            const tempId = `temp-${Date.now()}`;
            const newImageWithId = {
                ...newImage,
                id: tempId,
            };
            queryClient.setQueryData(queryKey, (old) => {
                const currentImages = Array.isArray(old) ? old : [];
                return [...currentImages, newImageWithId];
            });
            return { tempId, previousImages, queryKey };
        },

        onError: (err, newImage, context) => {
            console.error('Error Post Imagefood :', err);

            if (context?.previousImages != null) {
                queryClient.setQueryData(
                    context.queryKey,
                    context.previousImages,
                );
            } else {
                queryClient.removeQueries({ queryKey: context.queryKey });
            }
        },

        onSettled: (data, error, newImage, context) => {
            if (data?.data) {
                queryClient.setQueryData(context.queryKey, (old) => {
                    if (!Array.isArray(old)) return [data.data];
                    return old.map((image) =>
                        image.id === context.tempId ? data.data : image,
                    );
                });
            }
        },
    });
};
