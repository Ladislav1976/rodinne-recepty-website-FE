import { createPutFood } from '../use-post';
import { useQueryClient, useMutation } from '@tanstack/react-query';

export const usePutFood = (
    axiosPrivate,
    setModalLoadingFlag,
    showMessage,
    makeImagesRecord,
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (food) => createPutFood(axiosPrivate, food),

        onError: (err, updatedFood, context) => {
            console.error('Error Put Food :', err);
            setModalLoadingFlag(false);
            showMessage('⚠️ Dáta sa nepodarilo uložiť.', true);
            throw err;
        },
        onSuccess: (data, context) => {
            const queryKey = ['foods', data.data.id];

            queryClient.setQueryData(queryKey, data?.data);
            makeImagesRecord(data?.data);
        },
    });
};
