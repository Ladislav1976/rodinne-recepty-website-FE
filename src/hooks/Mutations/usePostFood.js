import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createPostFood } from '../use-post';

export const usePostFood = (
    axiosPrivate,
    setModalLoadingFlag,
    showMessage,
    makeImagesRecord,
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (food) => createPostFood(axiosPrivate, food),

        onError: (err, newFood, context) => {
            console.log('Error Post Food :', err);
            setModalLoadingFlag(false);
            showMessage('⚠️ Dáta sa nepodarilo uložiť.', true);
            throw err;
        },
        onSuccess: (data, context) => {
            console.log('POST succeeded for food:', data.data);
            const queryKey = ['foods', data?.data?.id];

            queryClient.setQueryData(queryKey, data?.data);
            makeImagesRecord(data?.data);
        },
    });
};
