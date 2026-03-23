import style from '../assets/styles/Components/Image.module.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faXmark, faCamera } from '@fortawesome/free-solid-svg-icons';

function Img(props) {
    const [loaded, setLoaded] = useState(false);
    return (
        <>
            <div className={style.imageContainer}>
                <div
                    onClick={() => props.uploader(props.image)}
                    style={{
                        backgroundColor: '#f0f0f0',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {!loaded && <div className="skeleton-loader" />}{' '}
                    <img
                        className={style.foodimage}
                        src={props.image.image}
                        loading="eager"
                        fetchPriority="high"
                        // loading="lazy"
                        // onLoad={() => props.setImgLoader((prev) => prev + 1)}
                        onLoad={() => setLoaded(true)}
                        style={{
                            opacity: loaded ? 1 : 0,
                            transition: 'opacity 0.5s ease-in',
                        }}
                        alt="Preview"
                    />
                </div>
                <div
                    className={style.imageclicker}
                    onClick={() => props.uploader(props.image)}
                >
                    {' '}
                    <div className={style.imagecross}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>{' '}
                <input
                    type="checkbox"
                    className={style.checkboxInput}
                    aria-label="Checkbox pre zmazanie fotografie"
                />
                <div
                    className={
                        props.component === 'editcomponent' ||
                        props.component === 'newcomponent'
                            ? style.deleteIcon
                            : style.displayNone
                    }
                >
                    <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => {
                            props.makeImageDelete(props.image);
                        }}
                    />
                </div>
            </div>
        </>
    );
}
export default function Image(props) {
    const newImageUrlsRender = [];

    const [imgLoader, setImgLoader] = useState(0);
    const [load, setLoad] = useState(false);
    let imageURLs = (props.imageURLs || []).filter(
        (e) => e.statusDelete !== true,
    );

    useEffect(() => {
        if (imgLoader === props.imageURLs.length) {
            setLoad(true);
        }
    }, [imgLoader, props.imageURLs.length]);

    function uploader(image) {
        props.handlerImage(image);
        openModal();
    }

    function openModal(e) {
        props.setModalFlag(true);
    }

    (imageURLs || []).forEach((image, index) => {
        if (image.statusDelete === false) {
            newImageUrlsRender.push(
                <Img
                    setImgLoader={setImgLoader}
                    key={image.id}
                    image={image}
                    imageURLs={imageURLs}
                    uploader={uploader}
                    component={props.component}
                    makeImageDelete={props.makeImageDelete}
                />,
            );
        }
    });

    return (
        <>
            {!load ? (
                <p>Loading images...</p>
            ) : (
                <div className={style.imagebox}>
                    {props.component !== 'viewcomponent' && (
                        <>
                            <input
                                className={style.imageinput}
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,image/gif"
                                aria-label="Pridať fotografiu"
                                id="Fotografia"
                                onChange={props.onImageChange}
                                display="none"
                            />
                            <div className={style.imageIconBox}>
                                <label
                                    htmlFor="Fotografia"
                                    className={style.imageIcon}
                                    datatooltip="Pridať fotografiu"
                                >
                                    <FontAwesomeIcon
                                        icon={faCamera}
                                    ></FontAwesomeIcon>
                                </label>
                            </div>
                        </>
                    )}

                    {!imageURLs && (
                        <p className={style.numOfFiles} id="numOfFiles">
                            No Files chosen
                        </p>
                    )}
                    <div className={style.imagerender}>
                        {newImageUrlsRender}
                    </div>
                </div>
            )}
        </>
    );
}
