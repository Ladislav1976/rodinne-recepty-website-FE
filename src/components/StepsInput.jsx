import { useState } from 'react';
import style from '../assets/styles/components/StepsInput.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash,
    faCheck,
    faXmark,
    faFloppyDisk,
    faPlus,
    faAngleDown,
    faTrashCanArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import ModalStep from '../modals/ModalStep';
import StepInputMobile from './StepInputMobile';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { usePutStep } from '../hooks/Mutations/usePutStep';

function Step(props) {
    const [step, setStep] = useState(props.step);
    const [stepDefault, setStepDefault] = useState('');
    const [modalStepFlag, setModalStepFlag] = useState(false);
    const [isVisibleStep, setIsVisibleStep] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    const component = props.component;

    const putStep = usePutStep(
        axiosPrivate,

        props.showMessage,
        props.setIsSaving,
        props.itemsDw
    );

    function handleUpdateStep(event) {
        if (stepDefault === '') {
            setStepDefault(event.target.value);
            setStep({
                ...step,
                step: event.target.value,
            });
        } else {
            setStep({
                ...step,
                step: event.target.value,
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
    async function handlePutStep() {
        props.setIsSaving(true);
        putStep.mutate({ id: step.id, deleted_at: props.deleted_at });
    }
    return (
        <>
            <div
                className={
                    component === 'viewcomponent' ? style.stepContainerView : style.stepContainer
                }
            >
                <div className={style.stepid}>{props.index + 1}.</div>

                {component === 'viewcomponent' && (
                    <>
                        {' '}
                        <div
                            className={style.stepTextView}
                            style={{
                                fontWeight: !props.is_deleted
                                    ? ''
                                    : props.deleted_at === step.deleted_at
                                      ? 'bold'
                                      : '',

                                textDecoration: !props.is_deleted
                                    ? ''
                                    : props.deleted_at === step.deleted_at
                                      ? 'underline'
                                      : '',
                                color: !props.is_deleted
                                    ? ''
                                    : props.deleted_at === step.deleted_at
                                      ? 'green'
                                      : '',
                            }}
                        >
                            {step.step}

                            {props.is_deleted && props.deleted_at !== step.deleted_at && (
                                <div
                                    className={style.restoreIcon}
                                    onClick={handlePutStep}
                                    style={{
                                        color: props.deleted_at === step.deleted_at ? 'red' : '',
                                    }}
                                >
                                    <FontAwesomeIcon
                                        className={style.faTrashCan}
                                        icon={faTrashCanArrowUp}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}
                {(component === 'editcomponent' || component === 'newcomponent') && (
                    <>
                        <div className={style.buttonForStepText} onClick={openModal}></div>
                        <textarea
                            className={style.stepText}
                            type="text"
                            rows="10"
                            aria-label="Existujúci postup prípravy"
                            value={step.step}
                            onChange={handleUpdateStep}
                        />
                    </>
                )}

                {(component === 'editcomponent' || component === 'newcomponent') && (
                    <div className={style.iconBox}>
                        <div
                            className={stepDefault === '' ? style.OKIcon : style.editIcon}
                            onClick={() => handleUpdateStepList(step)}
                            datatooltip={stepDefault === '' ? 'OK' : 'Uložiť'}
                        >
                            <FontAwesomeIcon
                                color={stepDefault === '' ? '#558113' : '#fd0000'}
                                icon={stepDefault === '' ? faCheck : faFloppyDisk}
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
                            <div className={style.cancelIcon} onClick={() => handleCancelStep()}>
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                        )}
                    </div>
                )}

                {(component === 'editcomponent' || component === 'newcomponent') && (
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
    let uniqueID = new Date().toISOString();
    const component = props.component;

    function handleChangeStep(step) {
        setAddedStep(step);
    }

    function addStep(addedStep) {
        if (addedStep === '') return;
        props.handleAddStep({ id: uniqueID, step: addedStep, statusDelete: false }, stepsList);
        setAddedStep('');
    }

    function handleStepDelete(step) {
        props.deleteStep(step);
    }

    function openModal() {
        setModalStepFlag(true);
    }

    return (
        <>
            {' '}
            <div className={style.stepBox}>
                <div className={style.title}>
                    <p>Postup :</p>
                </div>
                {(component === 'editcomponent' || component === 'newcomponent') && (
                    <>
                        <div className={style.buttonForNewStepText} onClick={openModal}></div>{' '}
                        <textarea
                            className={style.newStepText}
                            onKeyDown={props.stepKeyDown}
                            placeholder="Pridať postup prípravy..."
                            aria-label="Nový postup prípravy"
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
                    </>
                )}{' '}
            </div>
            <div className={style.addedstep}>
                {stepsList
                    .filter((a) => a.statusDelete === false)
                    .map((res, index) => {
                        return (
                            <Step
                                step={res}
                                index={index}
                                key={res.id}
                                updateStepList={props.updateStepList}
                                handleStepDelete={handleStepDelete}
                                stepMove={props.stepMove}
                                component={component}
                                is_deleted={props.is_deleted}
                                deleted_at={props.deleted_at}
                                itemsDw={props.itemsDw}
                                showMessage={props.showMessage}
                                setIsSaving={props.setIsSaving}
                            />
                        );
                    })}
            </div>{' '}
            <ModalStep visible={modalStepFlag} setModalFlag={setModalStepFlag}>
                <StepInputMobile
                    isVisibleEdit={[isVisibleStep, setIsVisibleStep]}
                    step={addedStep}
                    index={'N'}
                    handleOnChange={handleChangeStep}
                    handleUpdateList={addStep}
                    setModalFlag={setModalStepFlag}
                />
            </ModalStep>
        </>
    );
}
