import { useQueryClient, useMutation } from '@tanstack/react-query';
import { putDataPrivate } from '../use-post';
import useAuth from '../useAuth';
export const usePutUser = ({
    setRole,
    setStatus,
    roleDefault,
    setRoleDefault,
    statusDefault,
    setStatusDefault,
    setImageContainer,
    setImageDefault,
    imageDefault,
    handlerSetError,
    axiosPrivate,
    controller,
    closeModal,
}) => {
    const queryClient = useQueryClient();
    const { auth, setAuth } = useAuth();
    return useMutation({
        mutationFn: (user) => putDataPrivate(axiosPrivate, controller, user),
        onMutate: async (updatedUser) => {
            const queryKey = ['users'];
            await queryClient.cancelQueries({ queryKey });
            const previousUsers = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old) => {
                if (!Array.isArray(old)) return [];
                return old.map((u) =>
                    u.id === updatedUser.id ? { ...u, ...updatedUser } : u,
                );
            });
            return { previousUsers };
        },
        onError: (err, newUser, context) => {
            console.error('Error Put User :', err);
            const queryKey = ['users'];
            if (context?.previousUsers) {
                queryClient.setQueryData(queryKey, context.previousUsers);
            }

            if (roleDefault) {
                setRole(roleDefault);
                setRoleDefault('');
            }

            if (statusDefault) {
                setStatus(statusDefault);
                setStatusDefault('');
            }

            if (imageDefault) {
                setImageContainer(imageDefault);
                setImageDefault('');
            }

            handlerSetError('Záznam sa nepodarilo uložiť');
        },
        onSettled: (data, error, updatedUser) => {
            const queryKey = ['users'];
            queryClient.invalidateQueries(queryKey);

            if (!error) {
                if (auth?.userRes?.id === updatedUser.id) {
                    setAuth((prev) => ({
                        ...prev,
                        userRes: {
                            ...prev.userRes,
                            ...data?.data,
                        },
                    }));
                }
                closeModal();
            }
        },
    });
};
