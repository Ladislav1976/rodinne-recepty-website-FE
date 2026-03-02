import style from '../assets/styles/Modals/ModalPreview.module.css';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
//props.visible -> says if modal should appear
export default function ModalPreview(props) {
    useEffect(() => {
        if (props.visible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [props.visible]);

    if (!props.visible) return null;

    function onModalClose(e) {
        e.stopPropagation();
        props.setModalFlag(false);
    }

    function onModalContentClick(event) {
        event.stopPropagation();
    }

    return createPortal(
        <div className={style.modalWrapper} onClick={onModalClose}>
            <div className={style.modal} onClick={onModalContentClick}>
                {props.children}
            </div>
        </div>,
        document.body,
    );
}
