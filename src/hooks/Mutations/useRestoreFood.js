import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createRestoreFood } from '../use-post';

export const useRestoreFood = (
    id,
    axiosPrivate,
    setModalLoadingFlag,
    showMessage,

    params
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => createRestoreFood(axiosPrivate, id, params),

        onError: (err, newFood, context) => {
            console.error('Error Post Food :', err);
            setModalLoadingFlag(false);
            showMessage('⚠️ Recept sa nepodarilo uložiť.', true);
            throw err;
        },
        onSuccess: (data) => {
            const searchParams =
                params instanceof URLSearchParams ? Object.fromEntries(params) : params;
            searchParams.is_deleted = false;

            const queryKey = ['foods', data?.data?.data.id, searchParams.toString()];

            queryClient.setQueryData(queryKey);
            queryClient.invalidateQueries({
                queryKey,
            });
            queryClient.invalidateQueries({
                queryKey: ['foodsList'],
            });
        },
    });
};
