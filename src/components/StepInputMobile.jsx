import { useState } from 'react';
import style from '../assets/styles/Components/StepInputMobile.module.css';

export default function StepInputMobile(props) {
    const [step, setStep] = useState(props.step ? props.step : '');

    function handleUpdateStep(e) {
        if (typeof step === 'object') {
            setStep({
                ...step,
                step: e.target.value,
            });
        }
        if (typeof step === 'string') {
            setStep(e.target.value);
        }
    }

    function handleSave() {
        if (typeof step === 'object') {
            props.handleOnChange(step.step);
        }
        if (typeof step === 'string') {
            props.handleOnChange(step);
        }
        props.handleUpdateList(step);
        props.setModalFlag(false);
    }

    return (
        <>
            <div className={style.main}>
                <div className={style.stepid}>{props.index}.</div>

                <textarea
                    className={style.stepText}
                    type="text"
                    value={step.step}
                    id="step"
                    autoComplete="off"
                    onChange={handleUpdateStep}
                />
                <div className={style.buttonContainer}>
                    <button
                        className={`${style.button} ${style.cancel}`}
                        onClick={() => props.setModalFlag(false)}
                    >
                        Zrušiť
                    </button>{' '}
                    <button
                        className={`${style.button} `}
                        onClick={handleSave}
                        disabled={!step ? true : false}
                    >
                        Uložiť
                    </button>
                </div>
            </div>
        </>
    );
}
