// import axios from 'axios';
import axios from '../api/axios';

export async function createPostStep(axiosPrivate, step) {
    return await axiosPrivate.post('steps/', step).then((res) => res);
}

export async function createPutStep(axiosPrivate, step) {
    return await axiosPrivate.put(`steps/${step.id}/`, step).then((res) => res);
}

export async function createDeleteStep(axiosPrivate, step) {
    return await axiosPrivate.delete(`steps/${step.id}/`).then((res) => {
        return {
            status: res.status,
        };
    });
}
export async function createDeleteTag(axiosPrivate, foodTag) {
    return await axiosPrivate.delete(`foodTags/${foodTag.id}/`);
}
export async function createDeleteGroup(axiosPrivate, foodTag) {
    return await axiosPrivate.delete(`tagGroups/${foodTag.id}/`);
}

export async function createDeleteUnit(axiosPrivate, unit) {
    return await axiosPrivate.delete(`unit/${unit.id}/`);
}

export async function createDeleteUrl(axiosPrivate, url) {
    return await axiosPrivate.delete(`url/${url.id}/`).then((res) => {
        return {
            status: res.status,
        };
    });
}

export async function createPutUrl(axiosPrivate, url) {
    return await axiosPrivate.put(`url/${url.id}/`, url).then((res) => res);
}

export async function createPostUrl(axiosPrivate, url) {
    return await axiosPrivate.post('url/', url).then((res) => res);
}

export async function createPostUnit(axiosPrivate, { unit }) {
    return (
        unit,
        await axiosPrivate
            .post('unit/', {
                unit,
            })
            .then((res) => res)
    );
}

export async function createPostIngredient(axiosPrivate, { ingredient }) {
    return await axiosPrivate
        .post('ingredient/', {
            ingredient,
        })
        .then((res) => res);
}

export async function createPostIngredients(axiosPrivate, ingredients) {
    return await axiosPrivate
        .post(
            'ingredients/',
            // id:ingredients.id,  units:ingredients.units, quantity:ingredients.quantity, ingredientName: ingredients.ingredientName, ingreposition:ingredients.ingreposition
            ingredients,
        )
        .then((res) => res);
}
export async function createPostFoodTag(axiosPrivate, foodTag) {
    return await axiosPrivate.post('foodTags/', foodTag);
}

export async function createPostTagGroup(axiosPrivate, tagGroup) {
    return await axiosPrivate.post('tagGroups/', tagGroup);
}

export async function createPostFood(axiosPrivate, food) {
    return await axiosPrivate
        .post('foods/', food, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
        .then((res) => res);
}

export async function createPostLogin(login) {
    return await axios
        .post('login', login, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
        .then((res) => res);
}
export async function createPutFood(axiosPrivate, food) {
    return await axiosPrivate.put(`foods/${food.id}/`, food).then((res) => res);
}

export async function createDeleteFood(axiosPrivate, food) {
    return await axiosPrivate.delete(`foods/${food.id}/`).then((res) => res);
}

export async function createPostImagefood(axiosPrivate, formdata) {
    return await axiosPrivate.post('imagefood/', formdata, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function createPutImagefood(
    axiosPrivate,
    putFormdata,
    controller,
) {
    return await axiosPrivate
        .patch(`imagefood/${putFormdata.id}/`, putFormdata.imageForm, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            signal: controller.signal,
        })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        });
}

export async function createDeleteImagefood(axiosPrivate, formdata) {
    return await axiosPrivate
        .delete(
            `imagefood/${formdata.id}/`,
            // formdata.imageForm,
            // {
            //     withCredentials: false,
            //     headers: {
            //         "X-CSRFToken": "csrftoken",
            //     },
            // }
        )
        .then((res) => {
            return {
                status: res.status,
            };
        })
        .catch((err) => {
            if (err.response?.status === 404) {
                console.warn(
                    `Image ${formdata.id} už neexistuje (404), ignorujem.`,
                );
                return { status: 204, data: 'Already deleted' }; // Tvárime sa, že je to OK
            } else {
                throw err;
            }
        });
}

export async function createDeleteIngredients(axiosPrivate, id) {
    return await axiosPrivate.delete(`ingredients/${id}/`).then((res) => res);
}

export async function createPutIngredients(axiosPrivate, ingredients) {
    //id,  units, quantity, ingredientName, ingreposition)
    return await axiosPrivate
        .put(`ingredients/${ingredients.id}/`, {
            id: ingredients.id,
            food: ingredients.food,
            units: [ingredients.units[0].id],
            quantity: ingredients.quantity,
            ingredientName: [ingredients.ingredientName[0].id],
            position: ingredients.position,
        })
        .then((res) => res);
}

export async function createPutUnits(axiosPrivate, units) {
    return await axiosPrivate.put(`unit/`, units).then((res) => res);
}

export async function putDataPrivate(axiosPrivate, controller, user) {
    try {
        const res = await axiosPrivate.patch(
            `users/${user.id}/`,
            user.userForm,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                signal: controller.signal,
            },
        );

        return res;
    } catch (error) {
        console.error('Detaily 400 chyby:', error.response?.data);
        throw error;
    }
}
