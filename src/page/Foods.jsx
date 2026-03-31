import style from '../assets/styles/pages/Foods.module.css';
import { useState, useEffect } from 'react';
import Modal from '../modals/Modal';
import ModalSearch from '../modals/ModalSearch';
import FoodItemList from '../components/FoodItemList';
import TagInput from '../components/TagInput';
import TagInputMobile from '../components/TagInputMobile';
import LeftPanelFilter from '../components/LeftPanelFilter';
import SaveError from '../reports/SaveError';
import MenuToggle from '../components/MenuToggle';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useFoodsDownload } from '../hooks/Queries/useFoodsDownload';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useInView } from 'react-intersection-observer';

function Foods(props) {
    const component = 'foodscomponent';
    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();
    const [toggle, setToggle] = useState(false);
    const [loadedImagesCount, setLoadedImagesCount] = useState();

    const [foods, setFoods] = useState([]);

    const [users, setUsers] = useState();
    const [tagGroups, setTagGroups] = useState();
    const [foodTags, setFoodTags] = useState();

    const [searchParams, setSearchParams] = useSearchParams(window.location.search);
    const paramsFoodView = new URLSearchParams(window.location.search);

    const foodTagsPar = searchParams.getAll('foodTags');
    const user__id__inPar = searchParams.getAll('user__id__in');
    const searchPar = searchParams.get('search');
    const pageSizePar = searchParams.get('page_size');
    const pagePar = searchParams.get('page');
    const deletedPar = searchParams.get('is_deleted');
    const { ref: refTop, inView: inViewTop } = useInView();
    const { ref: refBottom, inView: inViewBottom } = useInView();

    const { auth, setPage, pageSize, setPageSize, ordering, setOrdering } = useAuth();

    const location = useLocation();

    const foodsQf = useFoodsDownload(axiosPrivate, paramsFoodView, auth);

    useEffect(() => {
        if (foodsQf?.data !== undefined) {
            searchLoader();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [foodsQf?.isLoading, foodsQf?.data, users, tagGroups]);

    function orderingHandler(e) {
        paramsFoodView.set('ordering', e.target.value);
        paramsFoodView.set('page', 1);

        setPage(1);
        setSearchParams(paramsFoodView);
        setOrdering(e.target.value);
    }

    function pageSizeChange(e) {
        paramsFoodView.set('page_size', e.target.value);
        paramsFoodView.set('page', 1);
        setSearchParams(paramsFoodView);
        setPageSize(e.target.value);
        setPage(1);
    }

    function pageChange(newpage) {
        paramsFoodView.set('page', newpage);
        setPage(newpage);
        setSearchParams(paramsFoodView);
    }

    function searchLoader() {
        if (!foodTags || !users) return;

        let updatedSet = new Set(filterTagSet);

        let changed = false;

        if (
            searchPar &&
            !tagSearchInArray([...updatedSet], {
                id: 0,
                searchTag: searchPar,
                foodTag: searchPar,
            })
        ) {
            updatedSet.add({ id: 0, searchTag: searchPar, foodTag: searchPar });
            changed = true;
        }

        if (foodTagsPar.length > 0 && foodTags) {
            foodTagsPar.forEach((id) => {
                const tagObj = foodTags.find((tag) => tag.id === Number(id));

                if (tagObj && !tagSearchInArray([...updatedSet], tagObj)) {
                    updatedSet.add(tagObj);
                    changed = true;
                }
            });
        }
        if (user__id__inPar.length > 0 && users) {
            user__id__inPar.forEach((id) => {
                const userObj = users.find((u) => u.id === Number(id));
                if (userObj && !tagSearchInArray([...updatedSet], userObj)) {
                    updatedSet.add({
                        ...userObj,
                        foodTag: `${userObj.first_name} ${userObj.last_name}`,
                    });
                    changed = true;
                }
            });
        }
        if (
            deletedPar &&
            deletedPar === 'true' &&
            !tagSearchInArray([...updatedSet], {
                id: 0,
                foodTag: 'deleted',
                deleted: deletedPar,
            })
        ) {
            updatedSet.add({ id: 0, foodTag: 'deleted', deleted: deletedPar });
            changed = true;
        }

        if (changed) {
            setFilterTagSet(updatedSet);

            const nextFoodTagIds = getTagsByType(updatedSet, false, false, false);
            const nextUserIds = getTagsByType(updatedSet, true, false, false);
            const searchString = getTagsByType(updatedSet, false, true, false);
            const deletedBoolean = getTagsByType(updatedSet, false, false, true);
            searchParams.set('foodTags', nextFoodTagIds);
            searchParams.set('user__id__in', nextUserIds.join(','));
            searchParams.set('page', pagePar || 1);
            searchParams.set('search', searchString);
            searchParams.set('is_deleted', deletedBoolean);

            setSearchParams(searchParams);
        }
    }

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (foodsQf.isLoading || !foodsQf.data) {
            return;
        }

        const data = foodsQf.data;
        const results = data.results || [];

        setUsers(data.usersQf || []);
        setTagGroups(data.tagGroupQf || []);
        setFoodTags(data.tagsQf || []);

        const transformedFoods = results
            .map((item) => {
                if (!item) return null;
                const { thumbnail_url, ...rest } = item;
                return {
                    ...rest,
                    images: item.thumbnail_url,
                };
            })
            .filter(Boolean);

        if (isMobile && parseInt(pagePar) > 1) {
            setFoods((prev) => {
                const existingIds = new Set(prev.map((f) => f.id));
                const uniqueNew = transformedFoods.filter((f) => !existingIds.has(f.id));
                return [...prev, ...uniqueNew];
            });
        } else {
            setFoods(transformedFoods);
        }
    }, [foodsQf.data, foodsQf.isSuccess, foodsQf.isLoading, isMobile, pagePar]);

    useEffect(() => {
        if (inViewBottom && isMobile && !foodsQf.isFetching && foodsQf?.data?.next) {
            const currentP = parseInt(pagePar || 1);
            pageChange(currentP + 1);
        }
        if (inViewTop && isMobile && !foodsQf.isFetching && foodsQf?.data?.previous) {
            const currentP = parseInt(pagePar || 1);
            pageChange(currentP - 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        inViewTop,
        inViewBottom,
        isMobile,
        foodsQf.isFetching,
        foodsQf.data?.previous,
        foodsQf.data?.next,
        pagePar,
    ]);

    const [filterTagSet, setFilterTagSet] = useState(new Set([]));
    const [modalErrorFlag, setModalErrorFlag] = useState(false);
    const [modalSearchFlag, setModalSearchFlag] = useState(false);
    const [isVisibleSearch, setIsVisibleSearch] = useState(false);

    function getTagsByType(set, mode) {
        return Array.from(set)
            .filter((item) => {
                switch (mode) {
                    case 'email':
                        return !!item?.email;
                    case 'search':
                        return !!item?.searchTag;
                    case 'deleted':
                        return !!item?.deleted;
                    case 'tag':
                        return !item?.email;
                    default:
                        return false;
                }
            })
            .map((item) => {
                if (mode === 'search') return item.searchTag;
                if (mode === 'deleted') return item.deleted;
                return item.id;
            })
            .filter(Boolean);
    }
    function addTagToFoodTagSet(tag, array) {
        let newTagSet = new Set(array);

        newTagSet.add(tag);
        const tagIds = getTagsByType(newTagSet, 'tag');
        const userIds = getTagsByType(newTagSet, 'email');
        const searchString = getTagsByType(newTagSet, 'search');
        const deletedBoolean = getTagsByType(newTagSet, 'deleted');

        setSearchParams({
            foodTags: tagIds,
            user__id__in: userIds.join(','),
            ordering: ordering,
            page_size: pageSize,
            search: searchString,
            is_deleted: deletedBoolean.length > 0 ? deletedBoolean[0] : '',
            page: 1,
        });

        setFilterTagSet(newTagSet);
        setPage(1);
    }

    function searchAddToTagList(tag) {
        if (!tag) return;

        addTagToFoodTagSet(
            {
                id: 0,
                searchTag: tag,
                foodTag: tag,
            },
            []
        );
    }

    function deletedAddToTagList(tag) {
        if (!tag) return;

        addTagToFoodTagSet(
            {
                id: 0,

                foodTag: 'deleted',
                deleted: tag,
            },
            []
        );
    }

    function removeFromTagSet(tag) {
        const newFilterTagSet = Array.from(filterTagSet).filter((item) => {
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
            const deletedMatch =
                Boolean(item?.id === 0) &&
                Boolean(item?.deleted && tag?.deleted) &&
                item?.deleted === tag?.deleted;

            const match =
                (tagMatch && idMatch) ||
                (emailMatch && idMatch) ||
                (idMatch && searchMatch) ||
                (idMatch && deletedMatch);
            return !match;
        });

        searchParams.set('page', 1);
        setFilterTagSet(newFilterTagSet);
        if (newFilterTagSet.size === 0) {
            searchParams.set('page', 1);
            setSearchParams(searchParams);
        } else {
            const tagIds = getTagsByType(newFilterTagSet, 'tag');
            const userIds = getTagsByType(newFilterTagSet, 'email');
            const searchString = getTagsByType(newFilterTagSet, 'search');
            const deletedBoolean = getTagsByType(newFilterTagSet, 'deleted');

            searchParams.set('foodTags', tagIds);
            searchParams.set('user__id__in', userIds);
            searchParams.set('search', searchString);
            searchParams.set('is_deleted', deletedBoolean === 'true' ? 'true' : 'false');
            searchParams.set('page', 1);
            setSearchParams(searchParams);
        }
    }

    function tagSearchInArray(array, tag) {
        if (!tag || !array) return false;

        return array.some((item) => {
            const idMatch = item?.id === tag?.id;
            const tagMatch =
                Boolean(item?.id !== 0) &&
                Boolean(item?.foodTag && tag?.foodTag) &&
                item.foodTag?.toLowerCase() === tag.foodTag?.toLowerCase();
            const emailMatch =
                Boolean(item?.id !== 0) &&
                Boolean(item?.email && tag?.email) &&
                item.email === tag.email;
            const searchMatch =
                Boolean(item?.id === 0) &&
                Boolean(item?.searchTag && tag?.searchTag) &&
                item?.searchTag === tag?.searchTag;
            const deletedMatch =
                Boolean(item?.id === 0) &&
                Boolean(item?.deleted && tag?.deleted) &&
                item?.foodTag === tag?.foodTag &&
                item?.deleted === tag?.deleted;

            return (tagMatch && idMatch) || (emailMatch && idMatch) || searchMatch || deletedMatch;
        });
    }
    function filterTagSetCheck(tag) {
        const response = tagSearchInArray([...filterTagSet], tag);

        if (!response) {
            addTagToFoodTagSet(tag, filterTagSet);
        } else {
            removeFromTagSet(tag);
        }
    }
    useEffect(() => {
        setLoadedImagesCount(0);
    }, []);

    function handleImgLoader() {
        setLoadedImagesCount((prev) => prev + 1);
    }

    const allImagesLoaded = loadedImagesCount >= foods.length;
    return (
        <>
            {foodsQf.isLoading ? (
                <div className={style.loadingContainer}>
                    <FontAwesomeIcon
                        className={style.loadingIcon}
                        icon={faSpinner}
                        id="inpFileIcon"
                        spin
                    ></FontAwesomeIcon>
                </div>
            ) : (
                <>
                    <div
                        className={style.foodsmain}
                        style={{
                            opacity: allImagesLoaded ? 1 : 0,
                            visibility: allImagesLoaded ? 'visible' : 'hidden',
                        }}
                    >
                        {isMobile && (
                            <div ref={refTop} style={{ height: '2px', position: 'absolute' }} />
                        )}
                        <div className={style.panel}>
                            <MenuToggle toggle={[toggle, setToggle]} />
                            <TagInput
                                filterTagListState={filterTagSet}
                                searchAddToTagList={searchAddToTagList}
                                removeFromTagList={removeFromTagSet}
                                setModalFlag={setModalSearchFlag}
                            />
                            <button
                                className={`${style.button}`}
                                onClick={() =>
                                    navigate(`/recepty/novy_recept/`, {
                                        state: { foods: location },
                                    })
                                }
                            >
                                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                            </button>{' '}
                            <button
                                className={style.button}
                                onClick={() => deletedAddToTagList('true')}
                                style={{
                                    color: deletedPar === 'true' ? 'red' : '',
                                }}
                            >
                                <FontAwesomeIcon className={style.faXmark} icon={faXmark} />
                                <FontAwesomeIcon className={style.faTrashCan} icon={faTrashCan} />
                            </button>
                        </div>
                        <div className={style.main}>
                            <LeftPanelFilter
                                onFoodTagSet={filterTagSet}
                                handleAddTagToFoodTagsList={filterTagSetCheck}
                                foodTagsContainer={foodsQf?.data?.tags_list}
                                orderingHandler={orderingHandler}
                                component={component}
                                toggle={[toggle, setToggle]}
                                users={users || []}
                                tagGroups={tagGroups || []}
                                total_foods_count={foodsQf?.data?.total_foods_count || ''}
                            />

                            <FoodItemList
                                foods={foods}
                                filterTagList={filterTagSet}
                                location={location}
                                pageSizeChange={pageSizeChange}
                                pageChange={pageChange}
                                page={Number(pagePar)}
                                pageSize={pageSizePar}
                                deletedPar={deletedPar}
                                foodsQf={foodsQf}
                                isMobile={isMobile}
                                handleImgLoader={handleImgLoader}
                            ></FoodItemList>
                        </div>

                        <Modal visible={modalErrorFlag} setModalFlag={setModalErrorFlag}>
                            <SaveError></SaveError>
                        </Modal>
                        <ModalSearch visible={modalSearchFlag} setModalFlag={setModalSearchFlag}>
                            <TagInputMobile
                                isVisibleEdit={[isVisibleSearch, setIsVisibleSearch]}
                                filterTagListState={filterTagSet}
                                searchAddToTagList={searchAddToTagList}
                                removeFromTagList={removeFromTagSet}
                                setModalFlag={setModalSearchFlag}
                            />
                        </ModalSearch>
                        {isMobile && <div ref={refBottom} style={{ height: '2px' }} />}
                    </div>{' '}
                </>
            )}
        </>
    );
}

export default Foods;
