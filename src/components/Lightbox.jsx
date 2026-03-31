import style from '../assets/styles/components/Lightbox.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faFloppyDisk, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable';

export default function Lightbox(props) {
    const [isVisibleEdit, setIsVisibleEdit] = props.isVisibleEdit;
    const [imagePosition, setImagePosition] = props.imagePosition;
    const component = props.component;
    const [imageURLsList, setImageURLsList] = props.imageURLsList;

    function makeImagesSave() {
        props.imageURLsUpdater(imageURLsList);
        props.closeModal();
    }

    function imageDisplaydelete(newImageURLsList) {
        let i = imagePosition;
        while (newImageURLsList[i].statusDelete === true) {
            if (newImageURLsList.length > 1) {
                if (imagePosition > 0) {
                    i = i - 1;
                }
                if (imagePosition === 0) {
                    i++;
                }
            }
            if (newImageURLsList.length === 1) {
                i = '';
            }
        }
        return i;
    }
    function makeImageDelete(image) {
        let imageIDPosition = props.getPosition(image.id, imageURLsList);
        let newImageURLsList = imageURLsList.slice();
        newImageURLsList.splice(imageIDPosition, 1, {
            ...image,
            statusDelete: true,
        });
        setImageURLsList(newImageURLsList);
        setImagePosition(imageDisplaydelete(newImageURLsList));
    }

    function imageDisplayChange(move, image) {
        let position = props.getPosition(image.id, imageURLsList);
        if (isVisibleEdit) {
            imageDisplayMove(move, image, position);
        }
        if (!isVisibleEdit) {
            imgageDisplayStep(move, position);
        }
    }

    function moveImage(array, from, to) {
        return array.map((item, index) => {
            if (index === to) return array[from];
            if (index === from) return array[to];
            return item;
        });
    }
    function imageDisplayMove(move, image, position) {
        const newPosition = position + move;

        if (move > 0) {
            if (position < -1 + imageURLsList.length) {
                const newImageURLsList = moveImage(imageURLsList, position, newPosition);
                setImageURLsList(newImageURLsList);
                setImagePosition(newPosition);
            }
        }
        if (move < 0) {
            if (position > 0) {
                const newImageURLsList = moveImage(imageURLsList, position, newPosition);
                setImageURLsList(newImageURLsList);
                setImagePosition(newPosition);
            }
        }
    }

    function imgageDisplayStep(move, position) {
        if (move > 0) {
            if (position < -1 + imageURLsList.length) {
                let newPosition = position + move;
                setImagePosition(newPosition);
            }
        }
        if (move < 0) {
            if (position > 0) {
                let newPosition = position + move;
                setImagePosition(newPosition);
            }
        }
    }

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            imageDisplayChange(+1, imageURLsList[imagePosition]);
        },
        onSwipedRight: () => {
            imageDisplayChange(-1, imageURLsList[imagePosition]);
        },
        trackMouse: false,
        preventDefaultTouchmoveEvent: true,
    });
    let imageDispley = [];

    imageDispley.push(
        <>
            <div className={style.imageblock} key={imageURLsList[imagePosition].id}>
                <img
                    className={style.imagePreviewed}
                    loading="lazy"
                    image={imageURLsList[imagePosition]}
                    src={imageURLsList[imagePosition].image}
                    alt=""
                />
            </div>
        </>
    );

    let clicker = false;
    function click() {
        clicker = true;
    }

    const newImageUrlsRender1 = [];
    const newImageUrlsRender2 = [];

    if (imageURLsList.length < 1) {
        return;
    } else {
        let filterImageURLsList = imageURLsList.filter((e) => e.statusDelete === false);

        filterImageURLsList.forEach((image, index) => {
            let pos = props.getPosition(image.id, filterImageURLsList);
            if (pos === imagePosition) {
                click();
            }
            if (clicker) {
                newImageUrlsRender2.push(
                    <>
                        <img
                            className={style.imageadded}
                            key={image.id}
                            src={image.image}
                            loading="lazy"
                            onClick={() => props.handlerImage(image)}
                            alt="Preview"
                            id={pos === imagePosition ? style['imagedisplayed'] : style['']}
                        />
                    </>
                );
            }
            if (!clicker) {
                newImageUrlsRender1.push(
                    <>
                        <img
                            className={style.imageadded}
                            key={image.id}
                            src={image.image}
                            loading="lazy"
                            onClick={() => props.handlerImage(image)}
                            alt="Preview"
                            id={pos === imagePosition ? style['imagedisplayed'] : style['']}
                        />
                    </>
                );
            }
        });
    }
    return (
        <>
            <div className={style.main} {...handlers}>
                {isVisibleEdit && (
                    <div className={style.saveIcon} datatooltip="Uložiť" onClick={makeImagesSave}>
                        <FontAwesomeIcon icon={faFloppyDisk} />
                    </div>
                )}
                {isVisibleEdit && (
                    <div
                        className={style.trashIcon}
                        datatooltip="Zmazať fotografiu"
                        onClick={() => makeImageDelete(imageURLsList[imagePosition])}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </div>
                )}
                {!isVisibleEdit &&
                    (component === 'editcomponent' || component === 'newcomponent') && (
                        <div
                            className={style.editIcon}
                            onClick={() => setIsVisibleEdit(true)}
                            datatooltip="Upraviť"
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </div>
                    )}
                <div className={style.headbox}>
                    <div
                        className={style.prev}
                        onClick={() => {
                            imageDisplayChange(-1, imageURLsList[imagePosition]);
                        }}
                    >
                        &#10094;
                    </div>

                    <div className={style.imageDispley}>{imageDispley}</div>

                    <div
                        className={style.next}
                        onClick={() => {
                            imageDisplayChange(+1, imageURLsList[imagePosition]);
                        }}
                    >
                        &#10095;
                    </div>

                    <div className={style.cancel} onClick={props.closeModal} datatooltip="Zavrieť">
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>
                <div className={style.imageListBox}>
                    <div className={style.imageListBox1}>{newImageUrlsRender1}</div>
                    <div className={style.imageListBox2}>{newImageUrlsRender2}</div>
                </div>
            </div>
        </>
    );
}
