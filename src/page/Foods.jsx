import style from '../assets/styles/Pages/Foods.module.css';
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
import { faSpinner, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useFoodsDownload } from '../hooks/Queries/useFoodsDownload';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useInView } from 'react-intersection-observer';

function Foods(props) {
    const component = 'foodscomponent';
    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();
    const [toggle, setToggle] = useState(false);

    const [foods, setFoods] = useState([]);
    const [users, setUsers] = useState();
    const [tagGroups, setTagGroups] = useState();
    const [foodTags, setFoodTags] = useState();

    const [searchParams, setSearchParams] = useSearchParams();

    const foodTagsPar = searchParams.getAll('foodTags');
    const user__id__inPar = searchParams.getAll('user__id__in');
    const searchPar = searchParams.get('search');
    const pageSizePar = searchParams.get('page_size');
    const pagePar = searchParams.get('page');
    const orderingPar = searchParams.get('ordering');
    const { ref: refTop, inView: inViewTop } = useInView();
    const { ref: refBottom, inView: inViewBottom } = useInView();

    const {
        page,
        setPage,
        pageSize,
        setPageSize,
        ordering,
        setOrdering,
        setSearch,
    } = useAuth();

    const location = useLocation();

    const foodsQf = useFoodsDownload(
        axiosPrivate,
        foodTagsPar,
        searchPar,
        orderingPar,
        pagePar,
        pageSizePar,
        user__id__inPar,
    );

    useEffect(() => {
        if (foodsQf?.data !== undefined) {
            searchLoader();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [foodsQf?.isLoading, foodsQf?.data, users, tagGroups]);

    useEffect(() => {
        if (!orderingPar || !pagePar || !pageSizePar) {
            setSearchParams({
                ordering: ordering,
                page: page,
                page_size: pageSize,
                foodTags: foodTagsPar,
                user__id__in: user__id__inPar,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function paramsUpdater(params) {
        if (foodTagsPar != null) {
            return (params.foodTags = foodTagsPar);
        }
        if (user__id__inPar != null) {
            return (params.user__id__in = user__id__inPar);
        }
        if (searchPar != null) {
            return (params.search = searchPar);
        }
    }

    function orderingHandler(e) {
        setOrdering(e.target.value);
        let params = {};
        paramsUpdater(params);
        params.ordering = e.target.value;
        params.page = 1;
        params.page_size = pageSize;
        setPage(1);
        setSearchParams(params);
    }
    function pageSizeChange(e) {
        setPageSize(e.target.value);
        let params = {};
        paramsUpdater(params);
        params.ordering = ordering;
        params.page = 1;
        params.page_size = e.target.value;
        setSearchParams(params);
        setPage(1);
    }

    function pageChange(newpage) {
        setPage(newpage);
        let params = {};
        paramsUpdater(params);
        params.ordering = ordering;
        params.page = newpage;
        params.page_size = pageSize;
        setSearchParams(params);
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
            //
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
                // }
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

        if (changed) {
            setFilterTagSet(updatedSet);

            const nextFoodTagIds = getTagsByType(updatedSet, false, false);
            const nextUserIds = getTagsByType(updatedSet, true, false);
            const searchString = getTagsByType(updatedSet, false, true);

            setSearchParams({
                ordering: ordering,
                foodTags: nextFoodTagIds,
                user__id__in: nextUserIds.join(','),
                page: pagePar || 1,
                page_size: pageSize,
                search: searchString,
            });
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
                const uniqueNew = transformedFoods.filter(
                    (f) => !existingIds.has(f.id),
                );
                return [...prev, ...uniqueNew];
            });
        } else {
            setFoods(transformedFoods);
        }
    }, [foodsQf.data, foodsQf.isSuccess, foodsQf.isLoading, isMobile, pagePar]);

    useEffect(() => {
        if (
            inViewBottom &&
            isMobile &&
            !foodsQf.isFetching &&
            foodsQf?.data?.next
        ) {
            const currentP = parseInt(pagePar || 1);
            pageChange(currentP + 1);
        }
        if (
            inViewTop &&
            isMobile &&
            !foodsQf.isFetching &&
            foodsQf?.data?.previous
        ) {
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

    function getTagsByType(set, wantEmail, wantsearch) {
        let foodTags = Array.from(set)
            .filter((item) =>
                wantEmail
                    ? !!item?.email
                    : !wantsearch
                      ? !item?.email
                      : item?.searchTag,
            )
            .map((item) => (!wantsearch ? item.id : item.searchTag))
            .filter(Boolean);
        return foodTags;
    }
    function addTagToFoodTagSet(tag) {
        let newTagSet = new Set(filterTagSet);

        newTagSet.add(tag);
        const tagIds = getTagsByType(newTagSet, false, false);
        const userIds = getTagsByType(newTagSet, true, false);
        const searchString = getTagsByType(newTagSet, false, true);

        setSearchParams({
            foodTags: tagIds,
            user__id__in: userIds.join(','),
            ordering: ordering,
            page_size: pageSize,
            search: searchString,
            page: 1,
        });

        setFilterTagSet(newTagSet);
        setPage(1);
    }

    function searchAddToTagList(tag) {
        if (!tag) return;
        setSearch(tag);
        addTagToFoodTagSet({ id: 0, searchTag: tag, foodTag: tag });
    }

    function removeFromTagSet(tag) {
        const filteredArray = Array.from(filterTagSet).filter((item) => {
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

        let newFilterTagSet = new Set(filteredArray);

        setFilterTagSet(filteredArray);
        if (newFilterTagSet.size === 0) {
            setSearchParams({
                ordering: ordering,
                page: 1,
                page_size: pageSize,
            });
        } else {
            const tagIds = getTagsByType(newFilterTagSet, false, false);
            const userIds = getTagsByType(newFilterTagSet, true, false);
            const searchString = getTagsByType(newFilterTagSet, false, true);
            setSearchParams({
                foodTags: tagIds,
                user__id__in: userIds,
                search: searchString,
                ordering: ordering,
                page: 1,
                page_size: pageSize,
            });
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

            return (
                (tagMatch && idMatch) || (emailMatch && idMatch) || searchMatch
            );
        });
    }
    function filterTagSetCheck(tag) {
        const response = tagSearchInArray([...filterTagSet], tag);
        if (!response) {
            addTagToFoodTagSet(tag);
        } else {
            removeFromTagSet(tag);
        }
    }

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
                    <div className={style.foodsmain}>
                        {isMobile && (
                            <div
                                ref={refTop}
                                style={{ height: '2px', position: 'absolute' }}
                            />
                        )}
                        <div className={style.panel}>
                            <MenuToggle toggle={[toggle, setToggle]} />

                            <TagInput
                                filterTagListState={filterTagSet}
                                searchAddToTagList={searchAddToTagList}
                                removeFromTagList={removeFromTagSet}
                                setModalFlag={setModalSearchFlag}
                            />

                            <div
                                className={`${style.foodButton}`}
                                onClick={() =>
                                    navigate(`/recepty/novy_recept/`, {
                                        state: { foods: location },
                                    })
                                }
                            >
                                Nový recept
                            </div>
                            <div
                                className={`${style.iconButton}`}
                                onClick={() =>
                                    navigate(`/recepty/novy_recept/`, {
                                        state: { foods: location },
                                    })
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                ></FontAwesomeIcon>
                            </div>
                        </div>
                        <div className={style.main}>
                            <LeftPanelFilter
                                onFoodTagSet={filterTagSet}
                                handleAddTagToFoodTagsList={filterTagSetCheck}
                                // handleAddTagToFoodTagsList2={foodTagListCheck2}
                                foodTagsContainer={foodsQf?.data?.tags_list}
                                orderingHandler={orderingHandler}
                                component={component}
                                toggle={[toggle, setToggle]}
                                users={users || []}
                                tagGroups={tagGroups || []}
                                total_foods_count={
                                    foodsQf?.data?.total_foods_count || ''
                                }
                            />

                            <FoodItemList
                                foods={foods}
                                filterTagList={filterTagSet}
                                location={location}
                                pageSizeChange={pageSizeChange}
                                pageChange={pageChange}
                                page={page}
                                pageSize={pageSize}
                                foodsQf={foodsQf}
                                isMobile={isMobile}
                            ></FoodItemList>
                        </div>

                        <Modal
                            visible={modalErrorFlag}
                            setModalFlag={setModalErrorFlag}
                        >
                            <SaveError></SaveError>
                        </Modal>
                        <ModalSearch
                            visible={modalSearchFlag}
                            setModalFlag={setModalSearchFlag}
                        >
                            <TagInputMobile
                                isVisibleEdit={[
                                    isVisibleSearch,
                                    setIsVisibleSearch,
                                ]}
                                filterTagListState={filterTagSet}
                                searchAddToTagList={searchAddToTagList}
                                removeFromTagList={removeFromTagSet}
                                setModalFlag={setModalSearchFlag}
                            />
                        </ModalSearch>
                        {isMobile && (
                            <div ref={refBottom} style={{ height: '2px' }} />
                        )}
                    </div>{' '}
                </>
            )}
        </>
    );
}

export default Foods;
