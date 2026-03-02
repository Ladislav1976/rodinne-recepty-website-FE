/* eslint-disable array-callback-return */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepsInput from '../components/StepsInput';
import SaveLoading from '../reports/SaveLoading';
import SaveSaved from '../reports/SaveSaved';
import SaveError from '../reports/SaveError';
import Lightbox from '../components/Lightbox';
import style from '../assets/styles/Pages/NewFood.module.css';
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
} from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useItemsDownload } from '../hooks/Queries/useItemsDownload';

function ViewFood(props) {
    const id = useParams();
    let ID = parseInt(id.id);
    const axiosPrivate = useAxiosPrivate();

    const { auth, setUsercont, ordering, page, pageSize, search } = useAuth();

    const itemsDw = useItemsDownload(ID, axiosPrivate);

    const component = 'viewcomponent';
    const navigate = useNavigate();

    const params = new URLSearchParams({
        ordering: ordering,
        page: page,
        page_size: pageSize,
        search: search,
    });
    const navFoods = `/recepty?${params.toString()}`;

    const goBack = () => navigate(navFoods);

    const [modalLoadingFlag, setModalLoadingFlag] = useState(false);
    const [modalSavedFlag, setModalSavedFlag] = useState(false);
    const [modalErrorFlag, setModalErrorFlag] = useState(false);

    const [modalLightboxFlag, setModalLightboxFlag] = useState(false);
    const [isVisibleEdit, setIsVisibleEdit] = useState(false);

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
        if (!itemsDw.isLoading && itemsDw.data) {
            setName(itemsDw.data.name);
            setFoodTagSet(itemsDw.data.tags);
            setStepsList(itemsDw.data.steps);
            setIngredientsList(itemsDw.data.ingredients);
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
                <div className={style.main}>
                    {/* <div className={style.header}>RECEPT</div> */}
                    <div className={style.panel}>
                        <MenuToggle toggle={[toggle, setToggle]} />

                        <div className={style.messagebox}>{props.errMsg}</div>
                        <div className={style.buttonBox}>
                            <div
                                className={style.foodButton}
                                onClick={() =>
                                    navigate(`/recepty/${id.id}/email`)
                                }
                            >
                                {/* datatooltip="Upraviť" */}
                                <FontAwesomeIcon icon={faEnvelope} />
                            </div>

                            <div
                                className={style.foodButton}
                                id={style.buttonUpravit}
                            >
                                {/* datatooltip="Upraviť" */}
                                <FontAwesomeIcon
                                    onClick={() =>
                                        navigate(`/recepty/${id.id}/edit`)
                                    }
                                    icon={faPenToSquare}
                                />
                            </div>
                            <div className={style.foodButton}>
                                {/* datatooltip="Upraviť" */}
                                <FontAwesomeIcon
                                    onClick={() => goBack()} //`/recepty/?page_size=${20}`
                                    icon={faBackward}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.fooodbox}`}>
                        <div className={style.fooodboxMidpanel}>
                            <div className={style.fooodnamebox}>
                                <div className={style.foodnameView}>{name}</div>
                            </div>
                            <div className={style.date}>
                                Vytvorené: <br />{' '}
                                {user?.map((res) => res.first_name)}{' '}
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
                            ></IngredientInput>
                            {/* </div> */}

                            <Image
                                imageURLs={imageURLsList}
                                setModalFlag={setModalLightboxFlag}
                                handlerImage={handlerImage}
                                component={component}
                            ></Image>
                            {/* </div> */}
                            {/* </div> */}
                            <div className={style.thirdColumn}>
                                <UrlInput
                                    urlList={urlList}
                                    component={component}
                                ></UrlInput>

                                <StepsInput
                                    stepsList={stepsList}
                                    component={component}
                                ></StepsInput>
                            </div>
                        </div>
                    </div>
                </div>
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
            <Modal visible={modalErrorFlag} setModalFlag={setModalErrorFlag}>
                <SaveError></SaveError>
            </Modal>
            <ModalPreview
                visible={modalLightboxFlag}
                setModalFlag={setModalLightboxFlag}
            >
                <Lightbox
                    // imageURLsList={imagesDwn}
                    imageURLsList={[imageURLsList, setImageURLsList]}
                    closeModal={closeModal}
                    handlerImage={handlerImage}
                    getPosition={getPosition}
                    isVisibleEdit={[isVisibleEdit, setIsVisibleEdit]}
                    imagePosition={[imagePosition, setImagePosition]}
                    component={component}
                ></Lightbox>
            </ModalPreview>
        </>
    );
}
export default ViewFood;
