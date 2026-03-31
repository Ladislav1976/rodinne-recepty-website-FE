import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPutStep } from '../use-post';

export const usePutStep = (axiosPrivate, showMessage, setIsSaving, itemsDw) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (step) => createPutStep(axiosPrivate, step),

        onError: (err, previousImage, context) => {
            console.error('Error Put Step :', err);
            setIsSaving(false);
            showMessage('⚠️ Dáta sa nepodarilo obnoviť.', true);
            throw err;
        },
        onSuccess: async (data, context) => {
            await queryClient.cancelQueries({ queryKey: ['foods'] });

            await queryClient.removeQueries({
                queryKey: ['foods'],
                exact: false,
            });

            await queryClient.invalidateQueries({
                queryKey: ['foods', data.data.food],
                exact: false,
            });
            await showMessage('Dáta boli obnovené.', false);
            if (itemsDw?.refetch) {
                await itemsDw.refetch();
            }
        },
    });
};
