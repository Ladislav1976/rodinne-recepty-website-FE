import { useState, useEffect } from 'react';
import style from '../assets/styles/Components/LeftPanelFilter.module.css';
import useAuth from '../hooks/useAuth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
function FilterOption(props) {
    const component = props.component;
    const tag = props.tag;

    function handleFilterTagListArray(tag) {
        if (!tag || !props.filterTagListArray) return false;

        return props.filterTagListArray.some((item) => {
            const tagMatch =
                Boolean(item?.foodTag && tag?.foodTag) &&
                item?.foodTag?.toLowerCase() === tag?.foodTag?.toLowerCase() &&
                item?.id === tag?.id;
            const emailMatch =
                Boolean(item?.email && tag?.email) &&
                item?.email === tag?.email &&
                item?.id === tag?.id;
            const orderTagMatch =
                Boolean(item?.foodTag && tag?.orderTag) &&
                item?.foodTag?.toLowerCase() === tag?.orderTag?.toLowerCase();

            return tagMatch || emailMatch || orderTagMatch;
        });
    }

    function getOptionContainerStyle() {
        if (component === 'viewcomponent') {
            return style.filterOption;
        } else {
            return style.filterOption__clickable;
        }
    }

    function getLabelStyle() {
        if (component === 'viewcomponent') {
            return style.labelView;
        }
        if (component === 'foodscomponent') {
            return style.labelFoods;
        }
        if (component === 'editcomponent' || component === 'newcomponent') {
            return style.labelEdit;
        }
    }

    function getCheckmarkStyle() {
        if (component === 'viewcomponent') {
            return style.buttonView;
        } else {
            return style.buttonEdit;
        }
    }

    return (
        <div
            className={`${getOptionContainerStyle()} ${
                props.open ? style.isActive : ''
            } ${!handleFilterTagListArray(tag) ? style.unChecked : ''}`}
            onClick={() => props.handleAddTagToFoodTagsList(tag)}
        >
            <input
                type="checkbox"
                checked={handleFilterTagListArray(tag)}
                name="foodTagSet"
                aria-label="Checkbox pre označenie"
                className={style.checkboxInput}
                value={tag.foodTag}
                id={tag.foodTag}
                onChange={() => props.handleAddTagToFoodTagsList(tag)}
            />
            <div
                className={getCheckmarkStyle()}
                htmlFor="tag"
                onClick={() => props.handleAddTagToFoodTagsList(tag)}
            />
            <div className={getLabelStyle()}>
                {tag.label || tag.foodTag.toUpperCase()}

                <b className={style.tagQuantity}>
                    {props.foodTagsContainer
                        ? `  (${
                              props.tagList[props.index1].tags[props.index2]
                                  .quantity
                          })`
                        : ''}
                </b>
            </div>
        </div>
    );
}

function FilterCategory(props) {
    const component = props.component;

    const result =
        props.type === 'filterTag' || props.type === 'filterUser'
            ? setterOpenTagList(props.tag)
            : false;

    const [open, setOpen] = useState(result);

    useEffect(() => {
        setOpen(result);
    }, [result]);

    function setterOpenTagList(array) {
        if (!props.filterTagListArray) return;
        if (!array.tags) return;
        if (component === 'newcomponent') {
            return true;
        }
        if (component === 'editcomponent' || 'viewcomponent') {
            let result = false;
            for (let i = 0; i < props.filterTagListArray.length; i++) {
                for (let u = 0; u < array?.tags.length; u++) {
                    const tagMatch =
                        props.filterTagListArray[i]?.foodTag?.toLowerCase() ===
                        array?.tags[u]?.foodTag?.toLowerCase();
                    const emailMatch =
                        Boolean(
                            props.filterTagListArray[i].email &&
                            array?.tags[u]?.foodTag,
                        ) &&
                        props.filterTagListArray[i]?.email?.toLowerCase() ===
                            array?.tags[u]?.foodTag?.toLowerCase();
                    if (tagMatch || emailMatch) {
                        result = true;
                    }
                }
            }
            return result;
        }
    }

    function labelParents() {
        if (open) {
            return style.parentLabelActive;
        } else {
            return style.parentLabelInactive;
        }
    }

    function upDownCSS() {
        if (open) {
            return style.arrowDown;
        } else {
            return style.arrowUp;
        }
    }

    function handleCheckboxContainer() {
        if (component === 'viewcomponent') {
            return style.categoryHeader;
        } else {
            return style.categoryHeaderInteractive;
        }
    }

    function setterOpen() {
        if (
            component === 'editcomponent' ||
            component === 'foodscomponent' ||
            component === 'newcomponent'
        ) {
            if (!result) {
                setOpen(!open);
            } else {
                setOpen(true);
            }
        }
    }
    function sumQt(array) {
        let i = 0;
        array?.tags?.forEach((res) => (i += Number(res.quantity)));
        return i;
    }

    const getDynamicLabel = () => {
        if (props.type === 'ordering' && props.tag.tags) {
            const currentTagValue = props.filterTagListArray?.[0]?.foodTag;
            const activeOption = props.tag.tags.find(
                (child) => child.foodTag === currentTagValue,
            );

            return activeOption ? activeOption.label : props.tag.groupName;
        }

        return props.tag?.groupName;
    };
    let array = [];

    props.tag?.tags?.forEach((tag, index2) => {
        array.push(
            <FilterOption
                open={open}
                key={`${tag.id}${tag.foodTag}`}
                tag={tag}
                type={props.type}
                index2={index2}
                index1={props.index1}
                handleFilterTagListArray={props.handleFilterTagListArray}
                handleAddTagToFoodTagsList={props.handleAddTagToFoodTagsList}
                foodTagsContainer={props.foodTagsContainer}
                component={props.component}
                tagList={props.tagList}
                filterTagListArray={props.filterTagListArray}
            />,
        );
    });

    return (
        <>
            <div
                className={handleCheckboxContainer()}
                onClick={() => setterOpen()}
            >
                <div className={labelParents()}>
                    {getDynamicLabel()}{' '}
                    <b className={style.tagQuantity}>
                        {props.foodTagsContainer
                            ? `(${sumQt(props.tagList[props.index1])})`
                            : ''}
                    </b>
                </div>
                <div className={upDownCSS()}>&#10094;</div>
            </div>
            <div
                className={`${style.tagsContainer} ${
                    open ? style.isActive : ''
                }`}
            >
                {array}
            </div>
        </>
    );
}
export default function LeftPanelFilter(props) {
    const foodTagsContainer = props.foodTagsContainer;
    const component = props.component;

    const filterTagListArray = [...props.onFoodTagSet];
    const handleAddTagToFoodTagsList = props.handleAddTagToFoodTagsList;

    const { ordering } = useAuth();

    const users = props.users || [];
    const tagGroups = props.tagGroups || [];

    let usersOptions = {
        groupName: 'UŽÍVATELIA',
        tags: users
            ? users.map((u) => {
                  return {
                      ...u,
                      foodTag: `${u.first_name} ${u.last_name}`,
                  };
              })
            : [],
    };

    function sortingGroups(array) {
        const sortedArray = array
            ? [...array].sort((a, b) => a.groupName.localeCompare(b.groupName))
            : [];
        const finalArray = sortedArray.map((tag) => {
            return { ...tag, tags: sortingTags(tag?.tags) };
        });

        return finalArray;
    }

    function sortingTags(array) {
        return array
            ? [...array].sort((a, b) => a.foodTag.localeCompare(b.foodTag))
            : [];
    }
    let tagList = sortingGroups(tagGroups);

    let orderingOptions = {
        groupName: 'ZORADIŤ PODĽA',
        tags: [
            {
                foodTag: 'date',
                label: 'DÁTUMU ( NAJSTARŠÍ )',
            },
            {
                foodTag: '-date',
                label: 'DÁTUMU ( NAJNOVŠÍ )',
            },
            {
                foodTag: 'name',
                label: 'VZOSTUPNE ( A - Z )',
            },
            {
                foodTag: '-name',
                label: 'ZOSTUPNE ( Z - A )',
            },
        ],
    };

    for (let i of tagList) {
        for (let a of i.tags) {
            if (!i.quantity) {
                i.quantity = 0;
            }
            if (!a.quantity) {
                a.quantity = 0;
            }
        }
    }
    if (foodTagsContainer != null) {
        for (let a of foodTagsContainer) {
            for (let i of tagList) {
                if (i.tags == null) {
                    if (i.groupName === a.tag_name) {
                        i.quantity = a.tag_num;
                    }
                }
                if (i.tags != null) {
                    if (i.foodTag === a.tag_name) {
                        i.quantity = a.tag_num;
                    }
                    for (let e of i.tags) {
                        if (e.foodTag === a.tag_name) {
                            e.quantity = a.tag_num;
                        }
                    }
                }
            }
        }
    }

    let tagListRender = [];

    tagList.forEach((tag, index) => {
        tagListRender.push(
            <FilterCategory
                type="filterTag"
                tag={tag}
                key={`${tag.id || index}${tag.groupName}`}
                index1={index}
                handleAddTagToFoodTagsList={handleAddTagToFoodTagsList}
                foodTagsContainer={foodTagsContainer}
                filterTagListArray={filterTagListArray}
                component={component}
                tagList={tagList}
            />,
        );
    });

    const [toggle, setToggle] = props.toggle;

    return (
        <>
            <div
                className={`${style.sidebarFilter} ${
                    toggle ? style.isActive : ''
                }`}
                onClick={(e) => {
                    if (toggle && e.target === e.currentTarget) {
                        setToggle(!toggle);
                    }
                }}
            >
                <div className={style.container}>
                    <div
                        className={style.cancelButton}
                        onClick={() => {
                            if (toggle) {
                                setToggle(!toggle);
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </div>

                    {component === 'foodscomponent' && (
                        <>
                            <div className={style.selectContainer}>
                                <label
                                    className={
                                        component === 'foodscomponent'
                                            ? style.selectLabel
                                            : style.displayNone
                                    }
                                    htmlFor="select_ordering"
                                >
                                    ZORADIŤ PODĽA:
                                </label>
                                <FilterCategory
                                    type="ordering"
                                    key={`${orderingOptions.id}${orderingOptions.groupName}`}
                                    tag={orderingOptions}
                                    filterTagListArray={[{ foodTag: ordering }]}
                                    handleAddTagToFoodTagsList={(val) =>
                                        props.orderingHandler({
                                            target: { value: val.foodTag },
                                        })
                                    }
                                    component={component}
                                />
                            </div>
                        </>
                    )}

                    <div className={style.filterContainer}>
                        <label className={style.selectLabel}>
                            {component === 'foodscomponent'
                                ? 'FILTER: '
                                : 'Druh jedla: '}
                        </label>
                        {component === 'foodscomponent' && (
                            <FilterCategory
                                type="filterUser"
                                key={`${usersOptions.groupName}`}
                                tag={usersOptions}
                                filterTagListArray={filterTagListArray}
                                handleAddTagToFoodTagsList={
                                    handleAddTagToFoodTagsList
                                }
                                component={component}
                                tagList={usersOptions}
                            />
                        )}
                        {tagListRender}
                    </div>
                </div>
                {component === 'foodscomponent' && (
                    <div className={style.totalFoodsCount}>
                        <span>Počet receptov : </span>
                        <strong>{props.total_foods_count}</strong>
                    </div>
                )}
            </div>
        </>
    );
}
