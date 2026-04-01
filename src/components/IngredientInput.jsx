import { useEffect, useState } from 'react';
import style from '../assets/styles/components/IngredientInput.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTrash, faAngleDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import useDebounce from '../hooks/useDebounce';

function Quantity(props) {
    return (
        <>
            <div className={style.quantityIngredient}>{props.quantity}</div>
        </>
    );
}

function Unit(props) {
    return (
        <>
            <div className={style.unitIngredient}>{props.unit}</div>
        </>
    );
}

function Ingredient(props) {
    return <div className={style.ingIngredient}>{props.ing}</div>;
}
function Ing(props) {
    const component = props.component;
    console.log(props.is_deleted);
    return (
        <>
            <div className={style.ingredientContent}>
                <div className={style.qtUnit}>
                    <Quantity quantity={props.ing?.quantity} />
                    <Unit unit={props.ing?.unit?.unit} />
                </div>
                <div className={style.ingreUpDown}>
                    <Ingredient ing={props.ing?.ingredient?.ingredient} />
                    {(component === 'editcomponent' || component === 'newcomponent') && (
                        <>
                            <div className={style.upddownbox}>
                                <div className={style.upddownIcons}>
                                    <div
                                        className={style.up}
                                        onClick={() => {
                                            props.ingredientMove(props.group, -1, props.ing);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faAngleDown}></FontAwesomeIcon>
                                    </div>{' '}
                                    <div
                                        className={style.down}
                                        onClick={() => {
                                            props.ingredientMove(props.group, 1, props.ing);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faAngleDown}></FontAwesomeIcon>{' '}
                                    </div>
                                </div>{' '}
                                <FontAwesomeIcon
                                    className={style.iconDelete}
                                    icon={faTrash}
                                    onClick={() => {
                                        props.makeIngredientsDelete(props.group, props.ing);
                                    }}
                                ></FontAwesomeIcon>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

function IngredientGroup(props) {
    const unitQf = props.unitQf || [];
    const group = props.group;
    const [addedQuantity, setAddedQuantity] = useState(1);
    const [addedUnit, setAddedUnit] = useState(unitQf ? unitQf[0] : '');
    const [addedIngredient, setAddedIngredient] = useState('');
    const [groupName, setGroupName] = useState(group.groupName);

    const component = props.component;

    function handleAddIngredients() {
        props.addToIngredientList(group, addedQuantity, addedUnit, addedIngredient);
        setAddedIngredient('');
        setAddedQuantity(1);
        setAddedUnit(unitQf ? unitQf[0] : '');
    }

    function cleanString(text) {
        return text.trim().replace(/\s+/g, ' ').toLowerCase();
    }
    function handleChangeIngredient(event) {
        let uniqueID = new Date().toISOString();
        const ingreObj = {
            id: uniqueID,
            ingredient: cleanString(event.target.value),
        };
        setAddedIngredient(ingreObj);
    }
    function handleAddQuantity(event) {
        let qt = event.target.value;
        const VerNum = Number(qt) * 1;
        const isFloat = /\d+\.\d+/.test(qt);
        if (Number.isInteger(VerNum) || isFloat) {
            setAddedQuantity(qt);
        } else {
            props.handlerSetModalErrorMissing('Vložene množstvo nie je číslo');
        }
    }

    function handleAddUnit(item) {
        const res = unitQf.find((res) => res.id === item);
        setAddedUnit(res);
    }

    const debouncedGroupName = useDebounce(groupName, 1000);

    useEffect(() => {
        if (debouncedGroupName !== groupName) {
            props.updateIngreNameInIngredientsList(group, groupName);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedGroupName, groupName]);

    return (
        <>
            <div
                className={style.ingredientsbox}
                style={{
                    backgroundColor: !props.is_deleted
                        ? ''
                        : props.deleted_at === group.deleted_at
                          ? 'var(--grey)'
                          : '',
                }}
            >
                {component === 'viewcomponent' && (
                    <div className={style.title}>
                        <p
                            style={{
                                color: !props.is_deleted
                                    ? ''
                                    : props.deleted_at === group.deleted_at
                                      ? 'var(--greydark)'
                                      : '',
                            }}
                        >
                            {group.groupName}
                        </p>
                    </div>
                )}

                {(component === 'editcomponent' || component === 'newcomponent') && (
                    <div className={style.ingredientcontainer}>
                        <div className={style.title}>
                            <div className={style.ingreGroupid}>{props.index + 1}.</div>

                            <input
                                className={style.groupNameEdit}
                                id="groupName"
                                name="groupName"
                                aria-label="Existujúca skupina ingrediencíí"
                                value={groupName}
                                type="text"
                                onChange={(e) => setGroupName(e.target.value)}
                            />

                            <div className={style.upddownbox}>
                                <div className={style.upddownIcons}>
                                    <div
                                        className={style.up}
                                        onClick={() => {
                                            props.ingredientsGroupMove(group, -1, props.ing);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faAngleDown}></FontAwesomeIcon>
                                    </div>{' '}
                                    <div
                                        className={style.down}
                                        onClick={() => {
                                            props.ingredientsGroupMove(group, 1, props.ing);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faAngleDown}></FontAwesomeIcon>{' '}
                                    </div>
                                </div>{' '}
                                <FontAwesomeIcon
                                    className={style.iconDelete}
                                    icon={faTrash}
                                    onClick={() => {
                                        props.makeIngreGroupDelete(group);
                                    }}
                                ></FontAwesomeIcon>
                            </div>
                        </div>
                        <input
                            type="text"
                            className={style.quantity}
                            onKeyDown={props.qrKeyDown}
                            id="tm"
                            aria-label="Množstvo"
                            value={addedQuantity}
                            onChange={handleAddQuantity}
                        />

                        <select
                            className={style.unit}
                            aria-label="Existujúce jednotky na výber"
                            onChange={(e) => handleAddUnit(parseInt(e.target.value))}
                            value={addedUnit ? addedUnit.id : ''}
                            onKeyDown={props.unitKeyDown}
                        >
                            <option value={unitQf[0]?.id ? unitQf[0].id : ''} aria-label="Jednotka">
                                {unitQf[0]?.unit ? unitQf[0]?.unit : ''}
                            </option>
                            {(unitQf || []).slice(1).map(
                                (unit) =>
                                    unit && (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.unit}
                                        </option>
                                    )
                            )}
                        </select>

                        <input
                            type="text"
                            className={style.ingredientInput}
                            aria-label="Pridať surovinu"
                            placeholder="Pridať surovinu"
                            value={addedIngredient.ingredient || ''}
                            onKeyDown={props.ingKeyDown}
                            onChange={handleChangeIngredient}
                        />

                        <div className={style.iconAddIngre}>
                            <FontAwesomeIcon
                                icon={faPlus}
                                onClick={handleAddIngredients}
                            ></FontAwesomeIcon>
                        </div>
                    </div>
                )}
                <div className={style.ingredientListRender}>
                    {group.ingredients
                        .filter((a) => a.statusDelete === false)
                        .map((ingre, index) => {
                            return (
                                <Ing
                                    unitQf={unitQf}
                                    ing={ingre}
                                    group={group}
                                    key={index}
                                    index={index}
                                    makeIngredientsDelete={props.makeIngredientsDelete}
                                    component={component}
                                    ingredientMove={props.ingredientMove}
                                    is_deleted={props.is_deleted}
                                    deleted_at={props.deleted_at}
                                />
                            );
                        })}
                </div>
            </div>
        </>
    );
}

export default function IngredientInput(props) {
    const unitQf = props.unitsDw || [];
    const [addedGroup, setAddedGroup] = useState('Suroviny');
    const [inputNewGroupIsVisible, setInputNewGroupIsVisible] = useState(false);
    const component = props.component;

    function cleanString(text) {
        return text.trim().replace(/\s+/g, ' ');
    }
    function handleChangeGroup(event) {
        setAddedGroup(cleanString(event.target.value));
    }

    function handleAddIngredientsGroup() {
        props.addIngreGroupToIngredientList(addedGroup);
        setAddedGroup('');
    }

    return (
        <>
            <div className={style.ingredientsGroupBox}>
                <div className={style.ingredientsGroupcontainer}>
                    <div className={style.title}>
                        <p>Ingrediencie :</p>{' '}
                    </div>{' '}
                    {(component === 'editcomponent' || component === 'newcomponent') && (
                        <>
                            {component === 'editcomponent' && !inputNewGroupIsVisible && (
                                <div
                                    className={style.iconGroupVisible}
                                    onClick={() => setInputNewGroupIsVisible(true)}
                                >
                                    <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                </div>
                            )}
                            {(component === 'newcomponent' ||
                                (component === 'editcomponent' && inputNewGroupIsVisible)) && (
                                <>
                                    <input
                                        type="text"
                                        name="newGroup"
                                        className={style.groupInput}
                                        aria-label="Nová skupina ingrediencíí"
                                        id="tm"
                                        value={addedGroup}
                                        placeholder="Pridať skupinu ingrediencií"
                                        onChange={handleChangeGroup}
                                    />
                                    <div
                                        className={style.iconAddGroup}
                                        onClick={handleAddIngredientsGroup}
                                    >
                                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
                <div className={style.ingredientsGroupRender}>
                    {props.ingredientsList
                        .filter((i) => i.statusDelete === false)
                        .map((group, index) => {
                            return (
                                <IngredientGroup
                                    unitQf={unitQf}
                                    group={group}
                                    key={group.id}
                                    index={index}
                                    makeIngredientsDelete={props.makeIngredientsDelete}
                                    addToIngredientList={props.addToIngredientList}
                                    component={component}
                                    ingredientMove={props.ingredientMove}
                                    ingredientsGroupMove={props.ingredientsGroupMove}
                                    makeIngreGroupDelete={props.makeIngreGroupDelete}
                                    updateIngreNameInIngredientsList={
                                        props.updateIngreNameInIngredientsList
                                    }
                                    is_deleted={props.is_deleted}
                                    deleted_at={props.deleted_at}
                                />
                            );
                        })}
                </div>
            </div>
        </>
    );
}
