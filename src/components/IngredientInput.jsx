import { useEffect, useState } from 'react';
import style from '../assets/styles/Components/IngredientInput.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faTrash,
    faAngleDown,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
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

    return (
        <>
            <div className={style.ingredientContent}>
                <div className={style.qtUnit}>
                    <Quantity quantity={props.ing?.quantity} />
                    <Unit unit={props.ing?.unit?.unit} />
                </div>
                <div className={style.ingreUpDown}>
                    <Ingredient ing={props.ing?.ingredient?.ingredient} />
                    {(component === 'editcomponent' ||
                        component === 'newcomponent') && (
                        <>
                            <div className={style.upddownbox}>
                                <div className={style.upddownIcons}>
                                    <div
                                        className={style.up}
                                        onClick={() => {
                                            props.ingredientMove(
                                                props.group,
                                                -1,
                                                props.ing,
                                            );
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faAngleDown}
                                        ></FontAwesomeIcon>
                                    </div>{' '}
                                    <div
                                        className={style.down}
                                        onClick={() => {
                                            props.ingredientMove(
                                                props.group,
                                                1,
                                                props.ing,
                                            );
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faAngleDown}
                                        ></FontAwesomeIcon>{' '}
                                    </div>
                                </div>{' '}
                                <FontAwesomeIcon
                                    className={style.iconDelete}
                                    icon={faTrash}
                                    onClick={() => {
                                        props.makeIngredientsDelete(
                                            props.group,
                                            props.ing,
                                        );
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
        props.addToIngredientList(
            group,
            addedQuantity,
            addedUnit,
            addedIngredient,
        );
        setAddedIngredient('');
        setAddedQuantity(1);
        setAddedUnit(unitQf ? unitQf[0] : '');
    }

    function cleanString(text) {
        return text
            .trim() // Odstráni medzery zo začiatku a konca
            .replace(/\s+/g, ' ') // Nahradí 2 a viac medzier v strede jednou medzerou
            .toLowerCase();
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

    const debouncedGroupName = useDebounce(groupName, 10000);

    useEffect(() => {
        if (debouncedGroupName !== groupName) {
            props.updateIngreNameInIngredientsList(group, groupName);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedGroupName, groupName]);

    const ingredientListRender = [];
    group.ingredients.forEach((ingre, index) => {
        if (ingre.statusDelete === false) {
            ingredientListRender.push(
                <Ing
                    unitQf={unitQf}
                    ing={ingre}
                    group={group}
                    key={index}
                    index={index}
                    makeIngredientsDelete={props.makeIngredientsDelete}
                    component={component}
                    ingredientMove={props.ingredientMove}
                />,
            );
        }
    });

    return (
        <>
            <div className={style.ingredientsbox}>
                {component === 'viewcomponent' && (
                    <div className={style.title}>
                        <p>{group.groupName} :</p>
                    </div>
                )}

                {(component === 'editcomponent' ||
                    component === 'newcomponent') && (
                    <div className={style.ingredientcontainer}>
                        <div className={style.title}>
                            <div className={style.ingreGroupid}>
                                {props.index + 1}.
                            </div>

                            <input
                                className={style.groupNameEdit}
                                id="groupName"
                                name="groupName"
                                aria-label="Existujúca skupina ingrediencíí"
                                value={groupName}
                                // onKeyDown={nameKeyDown}
                                type="text"
                                // maxLength="100"
                                onChange={(e) => setGroupName(e.target.value)}
                            />

                            <div className={style.upddownbox}>
                                <div className={style.upddownIcons}>
                                    <div
                                        className={style.up}
                                        onClick={() => {
                                            props.ingredientsGroupMove(
                                                group,
                                                -1,
                                                props.ing,
                                            );
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faAngleDown}
                                        ></FontAwesomeIcon>
                                    </div>{' '}
                                    <div
                                        className={style.down}
                                        onClick={() => {
                                            props.ingredientsGroupMove(
                                                group,
                                                1,
                                                props.ing,
                                            );
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faAngleDown}
                                        ></FontAwesomeIcon>{' '}
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
                            {/* <FontAwesomeIcon
                                className={style.iconDelete}
                                icon={faTrash}
                                onClick={() => {
                                    props.makeIngreGroupDelete(group);
                                }}
                            ></FontAwesomeIcon> */}
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
                        {/* <input
                                type="text"
                                className={style.unit}
                                id="tm"
                                value={addedUnit}
                                onChange={handleChangeUnit}
                            /> */}
                        {/* <select
                            className={style.unit}
                            onChange={handleChangeUnit}
                            value={addedUnit}
                        
                            onKeyDown={props.unitKeyDown}
                        >
                            <option>-</option>
                            <option>ks</option>
                            <option>kg</option>
                            <option>g</option>
                            <option>dg</option>
                            <option>ml</option>
                            <option>dl</option>
                            <option>liter</option>
                            <option>pl</option>
                            <option>čl</option>
                            <option>kl</option>
                            <option>štipka</option>
                            <option>bal.</option>
                            <option>podľa potreby</option>
                            <option>plátky</option>
                            <option>konzerva</option>
                        </select> */}
                        <select
                            className={style.unit}
                            aria-label="Existujúce jednotky na výber"
                            onChange={(e) =>
                                handleAddUnit(parseInt(e.target.value))
                            }
                            value={addedUnit ? addedUnit.id : ''}
                            onKeyDown={props.unitKeyDown}
                        >
                            <option
                                value={unitQf[0]?.id ? unitQf[0].id : ''}
                                aria-label="Jednotka"
                            >
                                {unitQf[0]?.unit ? unitQf[0]?.unit : ''}
                            </option>
                            {(unitQf || []).slice(1).map(
                                (unit) =>
                                    unit && (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.unit}
                                        </option>
                                    ),
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
                        {/* <div
                        className={style.ingredientButton}
                        onClick={addIngredientToTagList}
                    >
                        Pridať
                    </div> */}
                        <div className={style.iconAdd}>
                            <FontAwesomeIcon
                                icon={faPlus}
                                onClick={handleAddIngredients}
                            ></FontAwesomeIcon>
                        </div>
                    </div>
                )}
                <div className={style.ingredientListRender}>
                    {ingredientListRender}
                </div>
            </div>
        </>
    );
}

export default function IngredientInput(props) {
    const unitQf = props.unitsDw || [];
    const [addedGroup, setAddedGroup] = useState('');
    const component = props.component;
    let ingredientsSet = props.ingredientsList;

    function cleanString(text) {
        return text
            .trim() // Odstráni medzery zo začiatku a konca
            .replace(/\s+/g, ' '); // Nahradí 2 a viac medzier v strede jednou medzerou
        // .toLowerCase();
    }
    function handleChangeGroup(event) {
        // let uniqueID = new Date().toISOString();
        // const groupObj = {
        //     id: uniqueID,
        //     groupName: cleanString(event.target.value),
        // };
        setAddedGroup(cleanString(event.target.value));
    }

    function handleAddIngredientsGroup() {
        props.addIngreGroupToIngredientList(addedGroup);
        setAddedGroup('');
    }
    const ingredientsGroupRender = [];

    ingredientsSet.forEach((group, index) => {
        if (group.statusDelete === false) {
            ingredientsGroupRender.push(
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
                />,
            );
        }
    });
    return (
        <>
            <div className={style.ingredientsGroupBox}>
                {(component === 'editcomponent' ||
                    component === 'newcomponent') && (
                    <div className={style.ingredientsGroupcontainer}>
                        <div className={style.title}>
                            <p>Ingrediencie :</p>
                        </div>
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
                            className={style.iconAdd}
                            onClick={handleAddIngredientsGroup}
                        >
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                        </div>
                    </div>
                )}
                <div className={style.ingredientsGroupRender}>
                    {ingredientsGroupRender}
                </div>
            </div>
        </>
    );
}
