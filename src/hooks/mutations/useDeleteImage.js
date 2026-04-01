import { useMutation } from '@tanstack/react-query';
import { createDeleteImagefood } from '../use-post';

export const useDeleteImage = (axiosPrivate, foodID) => {
    return useMutation({
        mutationFn: (image) => createDeleteImagefood(axiosPrivate, image),
        onError: (error) => {
            console.error('Error Delete Imagefood :', error);
        },
    });
};
