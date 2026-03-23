import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StepsInput from '../components/StepsInput';
import SaveLoading from '../reports/SaveLoading';
import SaveSaved from '../reports/SaveSaved';
import DeleteConfirm from '../reports/DeleteConfirm';
import SaveError from '../reports/SaveError';

import Lightbox from '../components/Lightbox';
import style from '../assets/styles/Pages/NewFood.module.css';
import IngredientInput from '../components/IngredientInput';
import LeftPanelFilter from '../components/LeftPanelFilter';

import Image from '../components/Image';
import UrlInput from '../components/UrlInput';
import Modal from '../modals/Modal';
import ModalPreview from '../modals/ModalPreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSpinner,
    faTrash,
    faBackward,
    faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useQueryClient } from '@tanstack/react-query';

import { useItemsDownload } from '../hooks/Queries/useItemsDownload';

import { usePutFood } from '../hooks/Mutations/usePutFood';
import { useDeleteFood } from '../hooks/Mutations/useDeleteFood';
import { usePostImage } from '../hooks/Mutations/usePostImage';
import { usePutImage } from '../hooks/Mutations/usePutImage';
import { useDeleteImage } from '../hooks/Mutations/useDeleteImage';
import useAuth from '../hooks/useAuth';
import MenuToggle from '../components/MenuToggle';
import ModalMessage from '../modals/ModalMessage';
import Message from '../reports/Message';
// import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';

function EditFood(props) {
    const id = useParams();
    let ID = parseInt(id.id);
    const [isSaving, setIsSaving] = useState(false);
    const [unitsDw, setUnitsDw] = useState([]);
    const [tagGroupsDw, setTagGroupsDw] = useState([]);
    const controller = new AbortController();
    const component = 'editcomponent';
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    let uniqueID = new Date().toISOString();
    const { setUsercont, ordering, pageSize, search, setPage } = useAuth();

    const itemsDw = useItemsDownload(ID, axiosPrivate, isSaving);

    const queryClient = useQueryClient();

    const params = new URLSearchParams({
        ordering: ordering,
        page: 1,
        page_size: pageSize,
        search: search,
    });
    const navFoods = `/recepty?${params.toString()}`;
    const nameRef = useRef();

    const [foodID, setFoodID] = useState('');
    const [user, setUser] = useState([]);
    const [name, setName] = useState('');
    const [ingredientsList, setIngredientsList] = useState([]);
    const [urlList, setUrlList] = useState([]);

    const [foodTagSet, setFoodTagSet] = useState(new Set([]));
    const [stepsList, setStepsList] = useState([]);
    const [imageURLsList, setImageURLsList] = useState([]);
    const [date, setDate] = useState('');

    const [toggle, setToggle] = useState(false);

    useEffect(() => {
        if (!itemsDw.isLoading && itemsDw.data && !foodID) {
            setFoodID(itemsDw.data.id);
            setName(itemsDw.data.name);
            setFoodTagSet(itemsDw.data.tags);
            setStepsList(itemsDw.data.steps);
            setIngredientsList(itemsDw.data.ingredientsGroup);
            setUrlList(itemsDw.data.urls);
            setDate(itemsDw.data.date);
            setImageURLsList(itemsDw.data.images);
            setUser(itemsDw.data.user);
            setUsercont(itemsDw.data.usercont);
            setUnitsDw(itemsDw.data.units);
            setTagGroupsDw(itemsDw.data.tagGroups);

            // nameRef.current?.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsDw.data, foodID]);

    const [images, setImages] = useState([]);

    const [modalLoadingFlag, setModalLoadingFlag] = useState(false);
    const [modalSavedFlag, setModalSavedFlag] = useState(false);
    const [modalDeleteFlag, setModalDeleteFlag] = useState(false);
    const [modalMessageFlag, setModalMessageFlag] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [modalErrorFlag, setModalErrorFlag] = useState(false);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [errMsg, setErrMsg] = useState(props.errMsg || '');

    const [modalLightboxFlag, setModalLightboxFlag] = useState(false);
    const [isVisibleEdit, setIsVisibleEdit] = useState(false);

    const putFood = usePutFood(
        axiosPrivate,
        setModalLoadingFlag,
        showMessage,
        makeImagesRecord,
    );
    const deleteFood = useDeleteFood(
        axiosPrivate,
        // setModalLoadingFlag,
        // handlerSetModalError,
        // handlerFoodDeleteConfirmed,
    );
    const postImage = usePostImage(axiosPrivate);
    const putImage = usePutImage(axiosPrivate, controller);
    const deleteImage = useDeleteImage(axiosPrivate);
    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, [itemsDw.isLoading]);

    function handleFoodDelete() {
        setModalDeleteFlag(true);
    }

    function handleFoodSave(e) {
        e.preventDefault();
        setIsSaving(true);
        const filterIngredients = ingredientsList.filter(
            (ingre) => ingre.position !== 'delete',
        );

        if (
            !name &&
            filterIngredients.length === 0 &&
            foodTagSet.size === 0 &&
            stepsList === ''
        ) {
            alert('Nazov , Suroviny, Druj jedla, Postup nie se uvedene');
        } else if (
            filterIngredients.length === 0 &&
            foodTagSet.size === 0 &&
            stepsList === ''
        ) {
            handlerSetModalErrorMissing(
                'Doplň chýbajúce informácie: , Suroviny, Druj jedla, Postup',
            );
        } else if (!name && foodTagSet.size === 0 && stepsList === '') {
            handlerSetModalErrorMissing(
                'Doplň chýbajúce informácie: Nazov , Druj jedla, Postup',
            );
        } else if (
            !name &&
            filterIngredients.length === 0 &&
            stepsList === ''
        ) {
            handlerSetModalErrorMissing(
                'Doplň chýbajúce informácie: Nazov, Suroviny, Postup',
            );
        } else if (
            !name &&
            filterIngredients.length === 0 &&
            foodTagSet.size === 0
        ) {
            handlerSetModalErrorMissing(
                'Doplň chýbajúce informácie: Nazov, Suroviny, Druj jedla',
            );
        } else if (!name && filterIngredients.length === 0) {
            handlerSetModalErrorMissing(
                'Doplň chýbajúce informácie: Nazov,Suroviny',
            );
        } else if (!name && foodTagSet.size === 0) {
            handlerSetModalErrorMissing(
                'Doplň chýbajúce informácie: ,Nazov, Druj jedla',
            );
        } else if (!name && stepsList === '') {
            handlerSetModalErrorMissing(
                'Doplň chýbajúce informácie: Nazov, Postup',
            );
        } else if (filterIngredients.length === 0 && foodTagSet.size === 0) {
            handlerSetModalErrorMissing(
                'Doplň chýbajúce informácie: Suroviny,Druj jedla',
            );
        } else if (filterIngredients.length === 0 && stepsList === '') {
            handlerSetModalErrorMissing(
                'Doplň chýbajúce informácie: Suroviny,Postup',
            );
        } else if (!name) {
            handlerSetModalErrorMissing('Doplň chýbajúce informácie: Nazov');
        } else if (filterIngredients.length === 0) {
            handlerSetModalErrorMissing('Doplň chýbajúce informácie: Suroviny');
        } else if (foodTagSet.size === 0) {
            handlerSetModalErrorMissing(
                'Doplň chýbajúce informácie: Druj jedla',
            );
        } else if (stepsList === '') {
            handlerSetModalErrorMissing('Druj jedla nie je uvedeny');
        } else {
            makeFoodRecord({
                id: foodID,
                name: name,
                date: date,
                foodTags: [...foodTagSet].map((tag) => tag.id),
                user: user[0].id,
                steps: stepsList
                    ?.filter((i) => !i.statusDelete)
                    .map((res, index) => {
                        return {
                            step: res.step,
                            position: index + 1,
                        };
                    }),
                urls: urlList
                    ?.filter((i) => !i.statusDelete)
                    .map((res, index) => {
                        return {
                            url: res.url,
                            urlname: res.urlname,
                        };
                    }),
                ingredientsGroup: ingredientsList
                    ?.filter((i) => !i.statusDelete)
                    .map((group, index) => {
                        return {
                            ...group,
                            ingredients: group.ingredients.map((res, index) => {
                                return {
                                    units: res.unit.id,
                                    quantity: res.quantity,
                                    ingredientName: res.ingredient.ingredient,
                                    position: index + 1,
                                };
                            }),
                            position: index + 1,
                        };
                    }),
            });
        }
    }

    function tagSearchInArray(array, tag) {
        if (!tag || !array) return false;

        return array.some((item) => {
            if (String(item?.id) !== String(tag?.id)) return false;
            const tagMatch =
                item?.foodTag?.toLowerCase() === tag?.foodTag?.toLowerCase();
            const emailMatch = item?.email === tag?.email;

            return tagMatch || emailMatch;
        });
    }

    function foodTagSetCheck(tag) {
        const response = tagSearchInArray([...foodTagSet], tag);

        if (response) {
            removeFromFoodTagSet(tag);
        } else {
            addTagTofoodTagSet(tag);
        }
    }

    // eslint-disable-next-line no-unused-vars
    function normalizeText(text) {
        // Funkcia na odstranenie diakritiky
        return text
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }

    function addTagTofoodTagSet(foodTag) {
        let newFoodTagSet = new Set(foodTagSet);
        newFoodTagSet.add(foodTag);
        setFoodTagSet(newFoodTagSet);
    }

    function addToIngredientList(group, quantity, unit, ing) {
        if (!group || !quantity || !unit || !ing) {
            return;
        }
        let position = getPosition(group.id, ingredientsList);
        let newIngredientsList = ingredientsList.slice();
        newIngredientsList.splice(position, 1, {
            ...group,
            ingredients: [
                ...group.ingredients,
                {
                    id: uniqueID,
                    quantity: quantity,
                    unit: unit,
                    ingredient: ing,
                    statusDelete: false,
                },
            ],
        });
        setIngredientsList(newIngredientsList);
    }
    function updateIngreNameInIngredientsList(group, groupName) {
        if (!groupName || !group) return;
        let position = getPosition(group.id, ingredientsList);
        let newIngredientsList = ingredientsList.slice();
        newIngredientsList.splice(position, 1, {
            ...group,
            groupName: groupName,
        });
        setIngredientsList(newIngredientsList);
    }

    function addIngreGroupToIngredientList(group) {
        if (!group) return;

        let newIngredientsList = ingredientsList.slice();

        newIngredientsList.push({
            id: uniqueID,
            groupName: group,
            ingredients: [],
            statusDelete: false,
        });

        setIngredientsList(newIngredientsList);
    }

    function makeIngredientsDelete(group, ingre) {
        let position = getPosition(group.id, ingredientsList);
        let newIngredientsList = ingredientsList.slice();
        newIngredientsList.splice(position, 1, {
            ...group,
            ingredients: makeItemDelete(ingre, group.ingredients),
        });
        setIngredientsList(newIngredientsList);
    }
    function makeIngreGroupDelete(ingre) {
        setIngredientsList(makeItemDelete(ingre, ingredientsList));
    }
    function makeSteptoDelete(step) {
        setStepsList(makeItemDelete(step, stepsList));
    }

    function makeUrlToDelete(url) {
        setUrlList(makeItemDelete(url, urlList));
    }

    function makeItemDelete(item, array) {
        let itemIDPosition = getPosition(item.id, array);
        let newArray = array.slice();
        newArray.splice(itemIDPosition, 1, { ...item, statusDelete: true });

        return newArray;
    }

    function updateStepList(step) {
        setStepsList(updateItemList(step, stepsList));
    }

    function updateUrlList(url) {
        setUrlList(updateItemList(url, urlList));
    }

    function updateItemList(itemObj, array) {
        let position = getPosition(itemObj.id, array);
        let newArray = array.slice();
        newArray.splice(position, 1, itemObj);

        return newArray;
    }

    function handleAddUrl(url, urlList) {
        if (url.url === '') return;
        setUrlList(addItem(url, urlList));
    }

    function handleAddStep(step, stepsList) {
        if (step.step === '') return;
        setStepsList(addItem(step, stepsList));
    }

    function addItem(itemObj, array) {
        let newArray = array.slice();
        newArray.push(itemObj);
        return newArray;
    }

    function removeFromFoodTagSet(tag) {
        const filteredArray = Array.from(foodTagSet).filter((item) => {
            const idMatch = item?.id === tag?.id;
            const tagMatch =
                Boolean(item?.id !== 0) &&
                Boolean(item?.foodTag && tag?.foodTag) &&
                item?.foodTag?.toLowerCase() === tag?.foodTag?.toLowerCase();
            const emailMatch =
                Boolean(item?.id !== 0) &&
                Boolean(item?.email && tag?.email) &&
                item?.email === tag?.email;
            const searchMatch =
                Boolean(item?.id === 0) &&
                Boolean(item?.searchTag && tag?.searchTag) &&
                item?.searchTag === tag?.searchTag;
            const match =
                (tagMatch && idMatch) || (emailMatch && idMatch) || searchMatch;
            return !match;
        });
        let newFoodTagSet = new Set(filteredArray);
        newFoodTagSet.delete(tag);
        setFoodTagSet(newFoodTagSet);
    }

    function handleDataID(res) {
        let array = [];
        res.forEach((r) => {
            if (!r) return;

            if (r.status === 204) return;
            if (r.data && r.data.id) {
                array.push(r.data.id);
            }
        });

        return array;
    }
    function createFormData(foodId, folder, file, pos) {
        const formData = new FormData();
        formData.append('food', foodId);
        formData.append('upload_folder', folder);
        formData.append('image', file);
        formData.append('position', pos);
        return formData;
    }

    function createSimpleFormData(foodId, pos) {
        const formData = new FormData();
        formData.append('food', foodId);
        formData.append('position', pos);
        return formData;
    }
    async function handlerImagiesForPost(food) {
        const newDate = new Date(date).toISOString().substring(0, 10);
        const seconds = new Date(date).getUTCMilliseconds();
        const results = [];
        for (const [index, res] of imageURLsList.entries()) {
            const isNewImage = typeof res.id === 'string';
            const isDeleted = res.statusDelete === true;
            const folderName = `${food.name}-${newDate}-${seconds}`;
            const position = index + 1;

            const postData = {
                imageFormForBackEnd: createFormData(
                    food.id,
                    folderName,
                    res.imageForBackEnd,
                    position,
                ),
                formdataForRCatch: {
                    food: food.id,
                    upload_folder: folderName,
                    image: res.image,
                    position,
                },
            };
            const putData = {
                id: res.id,
                imageForm: createSimpleFormData(food.id, position),
            };

            let response;
            try {
                if (!isNewImage && isDeleted) {
                    response = await deleteImage.mutateAsync(putData);
                } else if (isNewImage && !isDeleted) {
                    response = await postImage.mutateAsync(postData);
                } else if (!isNewImage && !isDeleted) {
                    response = await putImage.mutateAsync(putData);
                } else {
                    response = { status: 204 };
                }

                if (response) results.push(response);
            } catch (err) {
                console.error('Error Imagies', err);
                throw err;
            }
        }

        return {
            status: 'fullfilled',
            value: handleDataID(results),
        };
    }

    function makeFoodRecord(food) {
        setModalLoadingFlag(true);
        putFood.mutate(food);
    }

    async function makeImagesRecord(foodCreated) {
        try {
            const res = await handlerImagiesForPost(foodCreated);

            if (res) {
                queryClient.invalidateQueries(['imageFood', foodCreated.id]);
                queryClient.invalidateQueries({
                    queryKey: ['foods', foodCreated.id],
                });
                queryClient.invalidateQueries({
                    queryKey: ['foodsList'],
                });
                handlerSetModalSave('Uložené', false);
            }
        } catch (err) {
            console.error('ERROR recept sa nepodarilo uložiť.', err);
            setModalLoadingFlag(false);
            showMessage('⚠️ Recept sa nepodarilo uložiť.', true);
            setIsSaving(false);

            throw err;
        }
    }
    async function foodDelete() {
        // setModalDeleteFlag(false);
        // setModalLoadingFlag(true);
        return await deleteFood.mutateAsync({ id: foodID });
    }

    function imageURLsUpdater(imageURLsList) {
        setImageURLsList(imageURLsList);
    }

    function stepMove(move, step) {
        setStepsList(itemMove(move, step, stepsList));
    }

    function ingredientMove(group, move, ing) {
        if (!group || !move || !ing) return;
        let position = getPosition(group.id, ingredientsList);

        let newIngredientsList = ingredientsList.slice();
        newIngredientsList.splice(position, 1, {
            ...group,
            ingredients: itemMove(move, ing, group.ingredients),
        });
        setIngredientsList(newIngredientsList);
    }

    function ingredientsGroupMove(group, move) {
        if (!group || !move) return;
        // let position = getPosition(group.id, ingredientsList);

        // let newIngredientsList = ingredientsList.slice();
        // newIngredientsList.splice(position, 1, {
        //     ...group,
        //     ingredients: itemMove(move, ing, group.ingredients),
        // });
        setIngredientsList(itemMove(move, group, ingredientsList));
    }

    function itemMove(move, item, array) {
        if (!move || !item || !array) return;
        let position = getPosition(item.id, array);
        let newArray = array.slice();
        if (move > 0) {
            if (position === -1 + array.length) {
                return array;
            } else {
                newArray.splice(position, 1);
                newArray.splice(position + move, 0, item);
                return newArray;
            }
        }
        if (move < 0) {
            if (position === 0) {
                return array;
            } else {
                newArray.splice(position, 1);
                newArray.splice(position - 1, 0, item);
                return newArray;
            }
        }
    }

    function handlerFoodDeleteCancel() {
        setModalDeleteFlag(false);
        navigate(`/recepty/${id.id}/edit`);
    }

    function handlerFoodDeleteConfirmed(message, isError) {
        setModalDeleteFlag(false);
        showMessage(message, isError);
        setTimeout(() => {
            if (!isError) {
                setPage(1);
                navigate(navFoods);
            }
            setIsSaving(false);
        }, 3000);
    }

    function handlerSetModalSave(message, isError) {
        setModalLoadingFlag(false);
        showMessage(message, isError);
        setTimeout(() => {
            if (!isError) navigate(`/recepty/${ID}/`);
        }, 3000);
    }

    function showMessage(message, isError) {
        setIsError(isError);
        setMessage(message);
        setModalMessageFlag(true);
        setTimeout(() => {
            setModalMessageFlag(false);
            setMessage('');
        }, 3000);
    }

    function handlerSetModalErrorMissing(message) {
        function handdlerMessage() {
            setErrMsg(message);
            setTimeout(() => {
                setErrMsg('');
            }, 3000);
        }
        if (!isMobile) {
            handdlerMessage();
        } else {
            showMessage(message, true);
            // handlerSetModalError(message);
        }
    }

    function closeModal(e) {
        setModalLightboxFlag(false);
        setIsVisibleEdit(false);
    }

    function getPosition(elementToFind, arrayElements) {
        let i;
        for (i = 0; i < arrayElements.length; i += 1) {
            if (arrayElements[i].id === elementToFind) {
                return i;
            }
        }
        return null;
    }

    const [imagePosition, setImagePosition] = useState('');

    function handlerImage(imageToAdd) {
        let position = getPosition(imageToAdd.id, imageURLsList);
        setImagePosition(position);
    }

    function makeImageDelete(image) {
        let imageIDPosition = getPosition(image.id, imageURLsList);
        let newImageURLsList = imageURLsList.slice();
        newImageURLsList.splice(imageIDPosition, 1, {
            ...image,
            statusDelete: true,
        });
        setImageURLsList(newImageURLsList);
    }

    useEffect(() => {
        if (images.length < 1) return;

        let newImageUrlsPost = imageURLsList.slice();

        let position = newImageUrlsPost.length + 1;
        images.forEach((image, index) => {
            newImageUrlsPost.push({
                id: `${uniqueID}${index}`,
                image: URL.createObjectURL(image),
                imageForBackEnd: image,
                position: position,
                statusDelete: false,
            });
            position++;
        }, setImageURLsList(newImageUrlsPost));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images]);

    function onImageChange(e) {
        setImages([...e.target.files]);
    }

    return (
        <>
            {itemsDw.isLoading && !itemsDw.data ? (
                <div className={style.loadingContainer}>
                    <FontAwesomeIcon
                        className={style.loadingIcon}
                        icon={faSpinner}
                        id="inpFileIcon"
                        spin
                    ></FontAwesomeIcon>
                </div>
            ) : (
                <form className={style.main} onSubmit={handleFoodSave}>
                    <div className={style.panel}>
                        <MenuToggle toggle={[toggle, setToggle]} />
                        <div className={style.messagebox}>{errMsg}</div>

                        <div className={style.buttonBox}>
                            <button
                                className={style.foodButton}
                                id={style.foodButtonSave}
                                type="submit"
                            >
                                <FontAwesomeIcon
                                    icon={faFloppyDisk}
                                    disabled={isSaving}
                                />
                            </button>
                            <div
                                className={style.foodButton}
                                id={style.foodButtonDelete}
                                onClick={handleFoodDelete}
                                // datatooltip="Vymazať"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </div>
                            <div
                                className={style.foodButton}
                                onClick={() => navigate(-1)}
                            >
                                <FontAwesomeIcon icon={faBackward} />
                            </div>
                        </div>
                    </div>
                    <div className={style.fooodbox}>
                        <div className={style.fooodboxMidpanel}>
                            <LeftPanelFilter
                                onFoodTagSet={foodTagSet}
                                handleAddTagToFoodTagsList={foodTagSetCheck}
                                foodTagsBox={null}
                                component={component}
                                toggle={[toggle, setToggle]}
                                tagGroups={tagGroupsDw}
                            />

                            <IngredientInput
                                addToIngredientList={addToIngredientList}
                                addIngreGroupToIngredientList={
                                    addIngreGroupToIngredientList
                                }
                                updateIngreNameInIngredientsList={
                                    updateIngreNameInIngredientsList
                                }
                                ingredientMove={ingredientMove}
                                ingredientsGroupMove={ingredientsGroupMove}
                                ingredientsList={ingredientsList}
                                handlerSetModalErrorMissing={
                                    handlerSetModalErrorMissing
                                }
                                makeIngredientsDelete={makeIngredientsDelete}
                                makeIngreGroupDelete={makeIngreGroupDelete}
                                component={component}
                                unitsDw={unitsDw}
                            ></IngredientInput>
                            <Image
                                imageURLs={imageURLsList}
                                makeImageDelete={makeImageDelete}
                                setModalFlag={setModalLightboxFlag}
                                handlerImage={handlerImage}
                                onImageChange={onImageChange}
                                component={component}
                            ></Image>
                            <div className={style.thirdColumn}>
                                <UrlInput
                                    urlList={urlList}
                                    component={component}
                                    deleteUrl={makeUrlToDelete}
                                    updateUrlList={updateUrlList}
                                    handleAddUrl={handleAddUrl}
                                    handlerSetModalErrorMissing={
                                        handlerSetModalErrorMissing
                                    }
                                ></UrlInput>

                                <StepsInput
                                    stepMove={stepMove}
                                    handleAddStep={handleAddStep}
                                    updateStepList={updateStepList}
                                    stepsList={stepsList}
                                    deleteStep={makeSteptoDelete}
                                    component={component}
                                ></StepsInput>
                            </div>
                            <div className={style.fooodnamebox}>
                                <label
                                    className={style.name}
                                    htmlFor="NázovReceptu"
                                >
                                    Názov:
                                </label>
                                <input
                                    className={style.foodname}
                                    id="NázovReceptu"
                                    name="Názov receptu"
                                    ref={nameRef}
                                    value={name}
                                    // onKeyDown={nameKeyDown}
                                    tabIndex="1"
                                    type="text"
                                    maxLength="300"
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <div className={style.name}> </div>
                            </div>
                            <div className={style.date}>
                                Vytvorené: <br />{' '}
                                {user.map((res) => res.first_name)}{' '}
                                {user.map((res) => res.last_name)}
                                <br />
                                {new Date(date).toLocaleDateString('sk-SK')}
                            </div>
                        </div>
                    </div>
                </form>
            )}
            <Modal
                visible={modalLoadingFlag}
                setModalFlag={setModalLoadingFlag}
            >
                <SaveLoading></SaveLoading>
            </Modal>
            <Modal visible={modalSavedFlag} setModalFlag={setModalSavedFlag}>
                <SaveSaved></SaveSaved>
            </Modal>
            <ModalMessage
                visible={modalDeleteFlag}
                setModalFlag={setModalDeleteFlag}
            >
                <DeleteConfirm
                    item={'recept'}
                    errMsg={errMsg}
                    handlerFoodDeleteConfirmed={handlerFoodDeleteConfirmed}
                    showMessage={showMessage}
                    onDelete={foodDelete}
                    setIsSaving={setIsSaving}
                    onDeleteCancel={handlerFoodDeleteCancel}
                ></DeleteConfirm>
            </ModalMessage>

            <ModalMessage
                visible={modalMessageFlag}
                setModalFlag={setModalMessageFlag}
            >
                <Message item={message} isError={isError}></Message>
            </ModalMessage>
            <Modal visible={modalErrorFlag} setModalFlag={setModalErrorFlag}>
                <SaveError></SaveError>
            </Modal>

            <ModalPreview
                visible={modalLightboxFlag}
                setModalFlag={setModalLightboxFlag}
            >
                <Lightbox
                    imageURLsList={[imageURLsList, setImageURLsList]}
                    closeModal={closeModal}
                    handlerImage={handlerImage}
                    getPosition={getPosition}
                    isVisibleEdit={[isVisibleEdit, setIsVisibleEdit]}
                    imagePosition={[imagePosition, setImagePosition]}
                    imageURLsUpdater={imageURLsUpdater}
                    component={component}
                ></Lightbox>
            </ModalPreview>
        </>
    );
}
export default EditFood;
