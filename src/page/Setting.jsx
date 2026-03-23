import style from '../assets/styles/Pages/Setting.module.css';
import TagGroup from '../components/TagGroup';
import Tag from '../components/Tag';
import Unit from '../components/Unit';
import { useTagGroups } from '../hooks/Queries/useTagGroups';
import { useUnit } from '../hooks/Queries/useUnit';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from '../modals/Modal';
import DeleteConfirm from '../reports/DeleteConfirm';
import { useDeleteTag } from '../hooks/Mutations/useDeleteTag';
import { useDeleteGroup } from '../hooks/Mutations/useDeleteGroup';
import { useDeleteUnit } from '../hooks/Mutations/useDeleteUnit';
import { useEffect, useState } from 'react';
import ModalMessage from '../modals/ModalMessage';
import Message from '../reports/Message';
import { usePutUnits } from '../hooks/Mutations/usePutUnits';
export default function Setting() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const [isSaving, setIsSaving] = useState(false);
    const tagGroupQf = useTagGroups(axiosPrivate);
    const unitQf = useUnit(axiosPrivate, isSaving);
    const groups = tagGroupQf?.data || [];

    const deleteTag = useDeleteTag(axiosPrivate);
    const deleteGroup = useDeleteGroup(axiosPrivate);
    const deleteUnit = useDeleteUnit(axiosPrivate);
    const putUnit = usePutUnits(axiosPrivate, controller);

    const [modalDeleteFlag, setModalDeleteFlag] = useState(false);
    const [modalMessageFlag, setModalMessageFlag] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');

    const [tagToDelete, setTagToDelete] = useState('');
    const [groupToDelete, setGroupToDelete] = useState('');
    const [unitToDelete, setUnitToDelete] = useState('');
    const [units, setUnits] = useState([]);

    useEffect(() => {
        if (!unitQf?.data) return;
        setUnits(unitQf?.data);
    }, [unitQf.data]);

    function handleTagDelete(tag) {
        if (!Number.isInteger(tag.id)) return;
        setTagToDelete(tag);
        setModalDeleteFlag(true);
    }

    function handleGroupDelete(tag) {
        if (!Number.isInteger(tag.id)) return;
        setGroupToDelete(tag);
        setModalDeleteFlag(true);
    }

    function handleUnitDelete(unit) {
        if (!Number.isInteger(unit.id)) return;
        setUnitToDelete(unit);
        setModalDeleteFlag(true);
    }
    function handlerFoodDeleteConfirmed(message, isError) {
        setModalDeleteFlag(false);
        showMessage(message, isError);
    }
    function showMessage(message, isError) {
        setIsError(isError);
        setMessage(message);
        setModalMessageFlag(true);
        setTimeout(() => {
            setModalMessageFlag(false);
            setMessage('');
            setIsSaving(false);
        }, 3000);
    }
    function deleteTagCanceled() {
        setModalDeleteFlag(false);
        setTagToDelete('');
        setGroupToDelete('');
        setUnitToDelete('');
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
    function itemMove(move, item, array) {
        let position = getPosition(item.id, array);

        let newArray = array.slice();
        if (move > 0) {
            if (position < -1 + array.length) {
                newArray.splice(position, 1);
                newArray.splice(position + move, 0, item);
                return newArray;
            } else {
                return array;
            }
        }
        if (move < 0) {
            if (position > 0) {
                newArray.splice(position, 1);
                newArray.splice(position - 1, 0, item);
                return newArray;
            } else {
                return array;
            }
        }
    }

    function moveUnits(move, unit) {
        const hasOrderChanged = (oldList, newList) => {
            if (!oldList || !newList || oldList.length !== newList.length)
                return true;

            return newList.some((item, index) => item.id !== oldList[index].id);
        };

        setUnits((prev) => {
            const newPrev = itemMove(move, unit, prev);
            if (hasOrderChanged(prev, newPrev)) {
                handleMoveUnit(newPrev);
                return newPrev;
            } else {
                return prev;
            }
        });
    }

    async function handleMoveUnit(units) {
        setIsSaving(true);
        const unitsforPost = units.map((unit, index) => {
            return { ...unit, position: index + 1 };
        });

        try {
            const res = await putUnit.mutateAsync(unitsforPost);
            if (res.status === 200) {
                showMessage('Uložené', false);
            }
        } catch (err) {
            if (err.status && err.response.data.detail) {
                showMessage(err.response.data.detail, true);
            } else {
                showMessage(`⚠️ Problem so serverom.`, true);
            }
        }
    }
    async function handleDeleteTag() {
        const id = tagToDelete?.id;
        if (!Number.isInteger(id)) return;
        return await deleteTag.mutateAsync({ id: id });
    }
    async function handleDeleteGroup() {
        const id = groupToDelete?.id;
        if (!Number.isInteger(id)) return;
        return await deleteGroup.mutateAsync({ id: id });
    }
    async function handleDeleteUnit() {
        const id = unitToDelete?.id;
        if (!Number.isInteger(id)) return;
        return await deleteUnit.mutateAsync({ id: id });
    }
    async function handleDelete() {
        if (tagToDelete) {
            return await handleDeleteTag();
        }
        if (groupToDelete) {
            return await handleDeleteGroup();
        }
        if (unitToDelete) {
            return await handleDeleteUnit();
        }
    }
    function sortingGroups(array) {
        return array
            ? [...array].sort((a, b) => a.groupName.localeCompare(b.groupName))
            : [];
    }

    function sortingTags(array) {
        return array
            ? [...array].sort((a, b) => a.foodTag.localeCompare(b.foodTag))
            : [];
    }
    if (tagGroupQf.isLoading || unitQf.isLoading) {
        return <div className={style.loadingContainer}>Načítavam ...</div>;
    }
    if (tagGroupQf.isError || unitQf.isError) {
        return <div className={style.error}>Chyba pri načítaní dát.</div>;
    }
    return (
        <>
            <div className={style.main}>
                <div className={style.container}>
                    <h3>Nastavenia</h3>
                    <div className={style.containerJednotky}>
                        <h3>Jednotky</h3>
                        <div className={style.inputContainer}>
                            <Unit />
                        </div>
                        <div className={style.unitContainer}>
                            <table
                                className={`${style.tagTable} ${style.unit}`}
                            >
                                <thead>
                                    <tr>
                                        <th>Jednotka</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unitQf.isSuccess &&
                                        units.map((unit) => (
                                            <tr key={unit.id}>
                                                <td
                                                    className={
                                                        style.groupHeaderCell
                                                    }
                                                >
                                                    <div>{unit.unit}</div>
                                                    <div
                                                        className={
                                                            style.upddownIcons
                                                        }
                                                    >
                                                        <div
                                                            className={style.up}
                                                            onClick={() => {
                                                                moveUnits(
                                                                    -1,
                                                                    unit,
                                                                );
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faAngleDown
                                                                }
                                                            ></FontAwesomeIcon>
                                                        </div>{' '}
                                                        <div
                                                            className={
                                                                style.down
                                                            }
                                                            onClick={() => {
                                                                moveUnits(
                                                                    1,
                                                                    unit,
                                                                );
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faAngleDown
                                                                }
                                                            ></FontAwesomeIcon>{' '}
                                                        </div>
                                                    </div>{' '}
                                                    <div
                                                        className={
                                                            style.deleteIcon
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                            onClick={() => {
                                                                handleUnitDelete(
                                                                    unit,
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={style.containerTags}>
                        <h3>Kategorizácia jedál</h3>
                        <div className={style.inputContainer}>
                            <TagGroup />
                            <Tag tagGroupQf={tagGroupQf} />
                        </div>
                        <div className={style.tagsContainer}>
                            {tagGroupQf.isSuccess &&
                                sortingGroups(groups).map((group) => {
                                    // Tagy zoradene podla abecedy
                                    const sortedTags = sortingTags(group?.tags);

                                    return (
                                        <table
                                            className={style.tagTable}
                                            key={group.id}
                                        >
                                            <thead>
                                                <tr>
                                                    <th>Kategória</th>
                                                    <th>Označenie </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedTags.length > 0 ? (
                                                    sortedTags.map(
                                                        (tag, index) => (
                                                            <tr
                                                                key={`${group.id}${tag.id}`}
                                                            >
                                                                {index ===
                                                                    0 && (
                                                                    <td
                                                                        rowSpan={
                                                                            group
                                                                                .tags
                                                                                .length
                                                                        }
                                                                        className={
                                                                            style.groupHeaderCell
                                                                        }
                                                                    >
                                                                        {
                                                                            group.groupName
                                                                        }{' '}
                                                                        <div
                                                                            className={
                                                                                style.deleteIcon
                                                                            }
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={
                                                                                    faTrash
                                                                                }
                                                                                onClick={() => {
                                                                                    handleGroupDelete(
                                                                                        group,
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                )}
                                                                <td
                                                                    className={
                                                                        style.tagCell
                                                                    }
                                                                >
                                                                    {
                                                                        tag.foodTag
                                                                    }
                                                                    <div
                                                                        className={
                                                                            style.deleteIcon
                                                                        }
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={
                                                                                faTrash
                                                                            }
                                                                            onClick={() => {
                                                                                handleTagDelete(
                                                                                    tag,
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )
                                                ) : (
                                                    <tr key={group.id}>
                                                        <td
                                                            className={
                                                                style.groupHeaderCell
                                                            }
                                                        >
                                                            {group.groupName}{' '}
                                                            <div
                                                                className={
                                                                    style.deleteIcon
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faTrash
                                                                    }
                                                                    onClick={() => {
                                                                        handleGroupDelete(
                                                                            group,
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td
                                                            className={
                                                                style.tagCell
                                                            }
                                                        >
                                                            <i>-</i>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
            <Modal visible={modalDeleteFlag} setModalFlag={setModalDeleteFlag}>
                <DeleteConfirm
                    item={
                        tagToDelete.foodTag ||
                        groupToDelete.groupName ||
                        unitToDelete.unit
                    }
                    handlerFoodDeleteConfirmed={handlerFoodDeleteConfirmed}
                    showMessage={showMessage}
                    setIsSaving={() => {}}
                    onDelete={handleDelete}
                    onDeleteCancel={deleteTagCanceled}
                ></DeleteConfirm>
            </Modal>
            <ModalMessage
                visible={modalMessageFlag}
                setModalFlag={setModalMessageFlag}
            >
                <Message item={message} isError={isError}></Message>
            </ModalMessage>
        </>
    );
}
