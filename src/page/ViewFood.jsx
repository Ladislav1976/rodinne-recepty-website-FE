import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepsInput from '../components/StepsInput';
import SaveLoading from '../reports/SaveLoading';
import SaveSaved from '../reports/SaveSaved';
import SaveError from '../reports/SaveError';
import Lightbox from '../components/Lightbox';
import style from '../assets/styles/pages/NewFood.module.css';
import IngredientInput from '../components/IngredientInput';
import LeftPanelFilter from '../components/LeftPanelFilter';
import MenuToggle from '../components/MenuToggle';

import Image from '../components/Image';
import UrlInput from '../components/UrlInput';
import Modal from '../modals/Modal';
import ModalPreview from '../modals/ModalPreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSpinner,
    faPenToSquare,
    faBackward,
    faEnvelope,
    faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons';

import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useItemsDownload } from '../hooks/Queries/useItemsDownload';
import { useRestoreFood } from '../hooks/Mutations/useRestoreFood';
import ModalMessage from '../modals/ModalMessage';
import Message from '../reports/Message';
import Confirm from '../reports/Confirm';

function ViewFood(props) {
    const id = useParams();
    let ID = parseInt(id.id);
    const axiosPrivate = useAxiosPrivate();

    const { auth, setUsercont, ordering, page, setPage, pageSize, search } = useAuth();

    const paramsFoods = new URLSearchParams(window.location.search);
    paramsFoods.set('ordering', ordering);
    paramsFoods.set('page', page);
    paramsFoods.set('page_size', pageSize);
    paramsFoods.set('search', search);
    paramsFoods.set('is_deleted', false);

    const paramsFoodEdit = new URLSearchParams(window.location.search);
    paramsFoodEdit.set('is_deleted', false);

    const paramsFoodView = new URLSearchParams(window.location.search);

    const is_deletedPar = paramsFoodView.get('is_deleted');
    const itemsDw = useItemsDownload(ID, axiosPrivate, false, paramsFoodView);

    const component = 'viewcomponent';
    const navigate = useNavigate();

    const navFoods = `/recepty?${paramsFoods.toString()}`;
    const navFoodsDelFalse = `/recepty?${paramsFoods.toString()}`;

    const goBack = () => navigate(navFoods);
    const [loadedImagesCount, setLoadedImagesCount] = useState();
    const [modalLoadingFlag, setModalLoadingFlag] = useState(false);
    const [modalSavedFlag, setModalSavedFlag] = useState(false);
    const [modalErrorFlag, setModalErrorFlag] = useState(false);
    const [modalDeleteFlag, setModalDeleteFlag] = useState(false);
    const [modalMessageFlag, setModalMessageFlag] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [modalLightboxFlag, setModalLightboxFlag] = useState(false);
    const [isVisibleEdit, setIsVisibleEdit] = useState(false);
    const [isError, setIsError] = useState(false);
    const [user, setUser] = useState([]);

    const [name, setName] = useState('');
    const [ingredientsList, setIngredientsList] = useState([]);
    const [urlList, setUrlList] = useState([]);
    const [foodTagSet, setFoodTagSet] = useState(new Set([]));

    const [imageURLsList, setImageURLsList] = useState([]);
    const [date, setDate] = useState('');

    const [toggle, setToggle] = useState(false);
    const restoreFood = useRestoreFood(
        ID,
        axiosPrivate,
        setModalLoadingFlag,
        showMessage,

        paramsFoodView
    );
    useEffect(() => {
        if (!itemsDw.isLoading && itemsDw.data) {
            setName(itemsDw.data.name);
            setFoodTagSet(itemsDw.data.tags);
            setIngredientsList(itemsDw.data.ingredientsGroup);
            setUrlList(itemsDw.data.urls);
            setDate(itemsDw.data.date);
            setImageURLsList(itemsDw.data.images);
            setUser(itemsDw.data.user);
            setUsercont(itemsDw.data.usercont);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsDw.data]);

    function closeModal(e) {
        setModalLightboxFlag(false);
        setIsVisibleEdit(false);
    }

    function getPosition(elementToFind, arrayElements) {
        var i;
        for (i = 0; i < arrayElements.length; i += 1) {
            if (arrayElements[i].id === elementToFind) {
                return i;
            }
        }
        return null;
    }

    const [imagePosition, setImagePosition] = useState('');
    function handlerImage(imageToAdd) {
        let imagePosition = getPosition(imageToAdd.id, imageURLsList);

        setImagePosition(imagePosition);
    }
    async function foodRestore() {
        setIsSaving(true);
        setModalLoadingFlag(true);
        return restoreFood.mutateAsync();
    }
    function handleFoodRestore() {
        setModalDeleteFlag(true);
        setMessage(`Tento recept bude obnovený.`);
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
    function handlerRestoreConfirmed(message, isError) {
        showMessage(message, isError);
        setTimeout(() => {
            if (!isError) {
                setPage(1);
                navigate(navFoodsDelFalse);
            }
            setIsSaving(false);
        }, 3000);
    }

    useEffect(() => {
        setLoadedImagesCount(0);
    }, []);

    function handleImgLoader() {
        setLoadedImagesCount((prev) => prev + 1);
    }

    const allImagesLoaded = loadedImagesCount >= imageURLsList.length;
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
                <div
                    className={style.main}
                    style={{
                        opacity: allImagesLoaded ? 1 : 0,
                        visibility: allImagesLoaded ? 'visible' : 'hidden',
                    }}
                >
                    <div className={style.panel}>
                        <MenuToggle toggle={[toggle, setToggle]} />

                        <div className={style.messagebox}>{props.errMsg}</div>
                        <div className={style.buttonBox}>
                            {is_deletedPar === 'true' && (
                                <div
                                    className={`${style.foodButton} ${style.foodButtonTrashOpen}`}
                                    onClick={handleFoodRestore}
                                >
                                    <FontAwesomeIcon icon={faFloppyDisk} disabled={isSaving} />
                                </div>
                            )}
                            {is_deletedPar !== 'true' && (
                                <>
                                    <div
                                        className={style.foodButton}
                                        onClick={() => navigate(`/recepty/${id.id}/email`)}
                                    >
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </div>
                                    <div className={style.foodButton} id={style.buttonUpravit}>
                                        <FontAwesomeIcon
                                            onClick={() =>
                                                navigate(
                                                    `/recepty/${id.id}/edit?${paramsFoodEdit.toString()}`
                                                )
                                            }
                                            icon={faPenToSquare}
                                        />
                                    </div>{' '}
                                </>
                            )}
                            <div className={style.foodButton}>
                                <FontAwesomeIcon onClick={() => goBack()} icon={faBackward} />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.fooodbox}`}>
                        <div className={style.fooodboxMidpanel}>
                            <div className={style.fooodnamebox}>
                                <div className={style.foodnameView}>{name}</div>
                            </div>
                            <div className={style.date}>
                                Vytvorené: <br /> {user?.map((res) => res.first_name)}{' '}
                                {user?.map((res) => res.last_name)}
                                <br />
                                {auth?.userRes?.is_superuser ||
                                user?.map((res) => res.id === auth?.userRes.id)
                                    ? new Date(date).toLocaleDateString('sk-SK')
                                    : ''}
                            </div>
                            <LeftPanelFilter
                                onFoodTagSet={foodTagSet}
                                foodTagsBox={null}
                                component={component}
                                toggle={[toggle, setToggle]}
                                handleAddTagToFoodTagsList={() => {
                                    return;
                                }}
                                tagGroups={itemsDw?.data?.tagGroups || []}
                            />

                            <IngredientInput
                                ingredientsList={ingredientsList}
                                component={component}
                                unitsDw={itemsDw?.data?.units || []}
                                is_deleted={itemsDw.data.is_deleted}
                                deleted_at={itemsDw.data.deleted_at}
                            ></IngredientInput>

                            <Image
                                imageURLs={imageURLsList}
                                setModalFlag={setModalLightboxFlag}
                                handlerImage={handlerImage}
                                handleImgLoader={handleImgLoader}
                                component={component}
                            ></Image>

                            <div className={style.thirdColumn}>
                                <UrlInput
                                    urlList={urlList}
                                    component={component}
                                    is_deleted={itemsDw.data.is_deleted}
                                    deleted_at={itemsDw.data.deleted_at}
                                ></UrlInput>

                                <StepsInput
                                    stepsList={itemsDw.data?.steps || []}
                                    component={component}
                                    is_deleted={itemsDw.data.is_deleted}
                                    deleted_at={itemsDw.data.deleted_at}
                                    itemsDw={itemsDw}
                                    showMessage={showMessage}
                                    setIsSaving={setIsSaving}
                                ></StepsInput>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Modal visible={modalLoadingFlag} setModalFlag={setModalLoadingFlag}>
                <SaveLoading></SaveLoading>
            </Modal>
            <Modal visible={modalSavedFlag} setModalFlag={setModalSavedFlag}>
                <SaveSaved></SaveSaved>
            </Modal>
            <Modal visible={modalErrorFlag} setModalFlag={setModalErrorFlag}>
                <SaveError></SaveError>
            </Modal>
            <ModalPreview visible={modalLightboxFlag} setModalFlag={setModalLightboxFlag}>
                <Lightbox
                    imageURLsList={[imageURLsList, setImageURLsList]}
                    closeModal={closeModal}
                    handlerImage={handlerImage}
                    getPosition={getPosition}
                    isVisibleEdit={[isVisibleEdit, setIsVisibleEdit]}
                    imagePosition={[imagePosition, setImagePosition]}
                    component={component}
                ></Lightbox>
            </ModalPreview>
            <ModalMessage visible={modalMessageFlag} setModalFlag={setModalMessageFlag}>
                <Message item={message} isError={isError}></Message>
            </ModalMessage>
            <ModalMessage visible={modalDeleteFlag} setModalFlag={setModalDeleteFlag}>
                <Confirm
                    handleDoConfirmed={handlerRestoreConfirmed}
                    showMessage={showMessage}
                    message={message}
                    do={foodRestore}
                    setIsSaving={setIsSaving}
                    cancel={() => setModalDeleteFlag(false)}
                    is_deleted={is_deletedPar}
                ></Confirm>
            </ModalMessage>
        </>
    );
}
export default ViewFood;
