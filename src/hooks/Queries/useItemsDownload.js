import { useMemo } from 'react';
import { useFood } from './useFood';

export const useItemsDownload = (ID, axiosPrivate, isSaving, params) => {
    const foodQf = useFood(ID, axiosPrivate, isSaving, params);

    const isLoading = foodQf.isLoading;
    const isError = foodQf.isError;

    const formattedData = useMemo(
        () => {
            if (isLoading || !foodQf.data) return null;

            function ensureArray(data) {
                if (!data) return [];

                const source = data.data ? data.data : data;
                return Array.isArray(source) ? source.flat() : [source];
            }

            const imagesArray = ensureArray(foodQf?.data?.images);
            const stepsArray = ensureArray(foodQf?.data?.steps);
            const tagsArray = Array.isArray(foodQf?.data?.foodTags) ? foodQf.data.foodTags : [];
            const urlsArray = ensureArray(foodQf?.data?.urls);
            const ingredientGroupArray = ensureArray(foodQf?.data?.ingredientsGroup);
            const unitsArray = ensureArray(foodQf?.data?.unitsQf);
            const tagGroupsArray = ensureArray(foodQf?.data?.tagGroupQf);

            return {
                id: foodQf?.data?.id,
                name: foodQf?.data?.name,
                date: foodQf?.data?.date,
                usercont: foodQf?.data?.user_details,
                user: foodQf?.data?.user_details
                    ? [
                          {
                              ...foodQf?.data?.user_details,
                              statusDelete: false,
                          },
                      ]
                    : [],

                tags: tagsArray,

                steps: stepsArray.map((element) => ({
                    ...element,
                    statusDelete: false,
                })),

                images: imagesArray
                    .map((element) => ({
                        ...element,
                        statusDelete: false,
                    }))
                    .sort((a, b) => a.position - b.position),
                urls: urlsArray.map((element) => ({
                    ...element,
                    statusDelete: false,
                })),
                ingredientsGroup: ingredientGroupArray
                    .map((group, i) => {
                        return {
                            ...group,
                            statusDelete: false,
                            ingredients: group.ingredients.map((element) => {
                                return {
                                    id: element.id,
                                    quantity: element.quantity ? element.quantity : '',
                                    ingredient: element.ingredientName
                                        ? element.ingredientName
                                        : [],
                                    unit: element.units ? element.units : [],
                                    position: element.position,
                                    statusDelete: false,
                                    is_deleted: element.is_deleted ? element.is_deleted : '',
                                    deleted_at: element.deleted_at ? element.deleted_at : '',
                                };
                            }),
                        };
                    })
                    .sort((a, b) => a.position - b.position),
                is_deleted: foodQf?.data?.is_deleted ? foodQf?.data?.is_deleted : '',
                deleted_at: foodQf?.data?.deleted_at ? foodQf?.data?.deleted_at : '',
                units: unitsArray,
                tagGroups: tagGroupsArray,
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isLoading, foodQf.data]
    );

    return {
        data: formattedData,
        isLoading,
        isError,
        refetch: foodQf.refetch,
    };
};
