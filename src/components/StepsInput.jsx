import { useState } from 'react';
import style from '../assets/styles/Components/StepsInput.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash,
    faCheck,
    faXmark,
    faFloppyDisk,
    faPlus,
    faAngleDown,
} from '@fortawesome/free-solid-svg-icons';
import ModalStep from '../modals/ModalStep';
import StepInputMobile from './StepInputMobile';

function Step(props) {
    const [step, setStep] = useState(props.step);
    const [stepDefault, setStepDefault] = useState('');
    const [modalStepFlag, setModalStepFlag] = useState(false);
    const [isVisibleStep, setIsVisibleStep] = useState(false);
    const component = props.component;

    function handleUpdateStep(step) {
        if (stepDefault === '') {
            setStepDefault(step);
            setStep({
                ...step,
                step: step,
            });
        } else {
            setStep({
                ...step,
                step: step,
            });
        }
    }
    function handleCancelStep() {
        if (stepDefault !== '') {
            setStep(stepDefault);
            setStepDefault('');
        }
    }

    function handleUpdateStepList(step) {
        props.updateStepList(step);
        setStepDefault('');
    }
    function handleStepMove(move, step) {
        props.stepMove(move, step);
    }
    function openModal() {
        setModalStepFlag(true);
    }
    return (
        <>
            <div
                className={
                    component === 'viewcomponent'
                        ? style.stepContainerView
                        : style.stepContainer
                }
            >
                <div className={style.stepid}>{props.index + 1}.</div>
                {/* <div className={style.stepBox}> */}
                {component === 'viewcomponent' && (
                    <div className={style.stepTextView}>{step.step}</div>
                )}
                {(component === 'editcomponent' ||
                    component === 'newcomponent') && (
                    <>
                        <div
                            className={style.buttonForStepText}
                            onClick={openModal}
                        ></div>
                        <textarea
                            className={style.stepText}
                            type="text"
                            rows="10"
                            value={step.step}
                            onChange={(event) =>
                                handleUpdateStep(event.target.value)
                            }
                        />
                    </>
                )}

                {(component === 'editcomponent' ||
                    component === 'newcomponent') && (
                    <div className={style.iconBox}>
                        <div
                            className={
                                stepDefault === ''
                                    ? style.OKIcon
                                    : style.editIcon
                            }
                            onClick={() => handleUpdateStepList(step)}
                            datatooltip={stepDefault === '' ? 'OK' : 'Uložiť'}
                        >
                            <FontAwesomeIcon
                                color={
                                    stepDefault === '' ? '#558113' : '#fd0000'
                                }
                                icon={
                                    stepDefault === '' ? faCheck : faFloppyDisk
                                }
                            />
                        </div>

                        <div
                            className={style.deleteIcon}
                            onClick={() => {
                                props.handleStepDelete(step);
                            }}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </div>
                        {stepDefault !== '' && (
                            <div
                                className={style.cancelIcon}
                                onClick={() => handleCancelStep()}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                        )}
                    </div>
                )}

                {(component === 'editcomponent' ||
                    component === 'newcomponent') && (
                    <div className={style.upddownbox}>
                        <div
                            className={style.up}
                            onClick={() => {
                                handleStepMove(-1, step);
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                onClick={() => {
                                    handleStepMove(-1, step);
                                }}
                            ></FontAwesomeIcon>
                        </div>
                        <div
                            className={style.down}
                            onClick={() => {
                                handleStepMove(1, step);
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                onClick={() => {
                                    handleStepMove(1, step);
                                }}
                            ></FontAwesomeIcon>{' '}
                        </div>
                    </div>
                )}
            </div>
            <ModalStep visible={modalStepFlag} setModalFlag={setModalStepFlag}>
                <StepInputMobile
                    isVisibleEdit={[isVisibleStep, setIsVisibleStep]}
                    step={step}
                    index={props.index + 1}
                    handleOnChange={handleUpdateStep}
                    handleUpdateList={handleUpdateStepList}
                    setModalFlag={setModalStepFlag}
                />
            </ModalStep>
        </>
    );
}

export default function StepsInput(props) {
    let stepsList = props.stepsList ?? [];
    const [addedStep, setAddedStep] = useState('');
    const [modalStepFlag, setModalStepFlag] = useState(false);
    const [isVisibleStep, setIsVisibleStep] = useState(false);
    const component = props.component;

    function handleChangeStep(step) {
        setAddedStep(step);
    }

    function addStep(addedStep) {
        if (addedStep === '') return;
        props.handleAddStep(
            { id: uniqueID, step: addedStep, statusDelete: false },
            stepsList,
        );
        setAddedStep('');
    }

    function handleStepDelete(step) {
        props.deleteStep(step);
    }

    function openModal() {
        setModalStepFlag(true);
    }

    const proceduteListRender = [];

    for (let i = 0; i < stepsList.length; i++) {
        if (stepsList[i].statusDelete === false) {
            proceduteListRender.push(
                <Step
                    step={stepsList[i]}
                    index={i}
                    key={stepsList[i].id}
                    updateStepList={props.updateStepList}
                    handleStepDelete={handleStepDelete}
                    stepMove={props.stepMove}
                    component={component}
                />,
            );
        }
    }

    let uniqueID = new Date().toISOString();

    if (component === 'viewcomponent')
        return (
            <div className={style.addedstep}>
                {' '}
                <div className={style.title}>
                    <p>Postup :</p>
                </div>
                {proceduteListRender}
            </div>
        );
    return (
        <>
            <div className={style.stepBox}>
                <div className={style.title}>
                    <p>Postup :</p>
                </div>{' '}
                <div
                    className={style.buttonForNewStepText}
                    onClick={openModal}
                ></div>{' '}
                <textarea
                    className={style.newStepText}
                    ref={props.stepRef}
                    onKeyDown={props.stepKeyDown}
                    placeholder="Napíšte postup prípravy..."
                    rows="10"
                    value={addedStep}
                    onChange={(e) => handleChangeStep(e.target.value)}
                />{' '}
                <div
                    className={style.newStepIcon}
                    datatooltip="Uložiť"
                    onClick={() => {
                        addStep(addedStep);
                    }}
                >
                    <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                </div>
            </div>
            <div className={style.addedstep}>{proceduteListRender}</div>
            <ModalStep visible={modalStepFlag} setModalFlag={setModalStepFlag}>
                <StepInputMobile
                    isVisibleEdit={[isVisibleStep, setIsVisibleStep]}
                    step={addedStep}
                    // searchAddToTagList={searchAddToTagList}
                    // removeFromTagList={removeFromTagSet}
                    index={'N'}
                    handleOnChange={handleChangeStep}
                    handleUpdateList={addStep}
                    setModalFlag={setModalStepFlag}
                />
            </ModalStep>
        </>
    );
}
