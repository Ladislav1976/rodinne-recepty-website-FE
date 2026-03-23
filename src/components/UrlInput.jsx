import style from '../assets/styles/Components/UrlInput.module.css';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash,
    faCheck,
    faXmark,
    faFloppyDisk,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';

function Url(props) {
    const [urlDefault, setUrlDefault] = useState('');
    const [urlNameDefault, setUrlNameDefault] = useState('');
    const [url, setUrl] = useState(props.url);
    const isChanged = urlDefault !== '' || urlNameDefault !== '';

    function handleUpdateUrlName(event) {
        if (!urlNameDefault) {
            setUrlNameDefault(url.urlname);
            setUrl({
                ...url,
                urlname: event.target.value,
            });
        } else {
            setUrl({
                ...url,
                urlname: event.target.value,
            });
        }
    }

    function handleUpdateUrl(event) {
        if (!urlDefault) {
            setUrlDefault(url.url);
            setUrl({
                ...url,
                url: event.target.value,
            });
        } else {
            setUrl({
                ...url,
                url: event.target.value,
            });
        }
    }
    function handleCancelUrl() {
        if (urlDefault) {
            setUrl({ ...url, url: urlDefault });
            setUrlDefault('');
        }
        if (urlNameDefault) {
            setUrl({ ...url, urlname: urlNameDefault });
            setUrlNameDefault('');
        }
    }

    function handleUpdateUrlList() {
        props.updateUrlList(url);
        setUrlDefault('');
        setUrlNameDefault('');
    }
    return (
        <div className={style.urlContainer}>
            {props.component === 'viewcomponent' && (
                <>
                    <div className={style.urlTextContainer}>
                        <div className={style.urlid}>{props.index + 1}.</div>
                        <div className={style.linkCont}>
                            <a
                                className={style.urlTextView}
                                href={props.url.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {props.url.urlname}
                            </a>{' '}
                        </div>
                    </div>
                </>
            )}

            {(props.component === 'editcomponent' ||
                props.component === 'newcomponent') && (
                <>
                    <div className={style.urlid}>{props.index + 1}.</div>
                    <div className={style.intContainer}>
                        <input
                            className={style.urlEditView}
                            value={url.urlname}
                            type="text"
                            id="urlname"
                            name="urlname"
                            aria-label="Meno existujúcej url adresy webovej stránky"
                            size={50}
                            onChange={handleUpdateUrlName}
                        />
                        <input
                            className={style.urlEditView}
                            value={url.url}
                            type="url"
                            id="url"
                            // pattern="https://.*"

                            name="url"
                            aria-label="Existujúca url adresa webovej stránky"
                            size={1000}
                            onChange={handleUpdateUrl}
                        />
                    </div>
                    <div className={style.iconBox}>
                        <div
                            className={
                                isChanged ? style.editIcon : style.OKIcon
                            }
                            // datatooltip={urlDefault === '' ? 'OK' : 'Uložiť'}
                        >
                            <FontAwesomeIcon
                                color={isChanged ? '#fd0000' : '#558113'}
                                icon={isChanged ? faFloppyDisk : faCheck}
                                onClick={() => {
                                    handleUpdateUrlList();
                                }}
                            />
                        </div>

                        <div className={style.deleteIcon}>
                            <FontAwesomeIcon
                                icon={faTrash}
                                onClick={() => {
                                    props.handleUrlDelete(url);
                                }}
                            />
                        </div>
                        {isChanged && (
                            <div
                                className={style.cancelIcon}
                                datatooltip="Zrušiť"
                            >
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    onClick={() => handleCancelUrl()}
                                />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

const URL_REGEX = /^https:\/\/([\w\d.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export default function UrlInput(props) {
    const urlList = props.urlList;
    const [addedUrl, setAddedUrl] = useState('');
    const [addedUrlName, setAddedUrlName] = useState('');
    const [validUrl, setValidUrl] = useState(false);
    let uniqueID = new Date().toISOString();
    const component = props.component;

    function handleUrlDelete(url) {
        props.deleteUrl(url);
    }

    useEffect(() => {
        setValidUrl(URL_REGEX.test(addedUrl));
    }, [addedUrl]);

    function addURL() {
        if (!addedUrl || !addedUrlName) return;
        if (!validUrl) {
            props.handlerSetModalErrorMissing(
                'Neplatný formát! Adresa musí začínať s "https://',
            );
            return;
        }

        props.handleAddUrl(
            {
                id: uniqueID,
                url: addedUrl,

                urlname: addedUrlName,
                statusDelete: false,
            },
            urlList,
        );
        setAddedUrl('');
        setAddedUrlName('');
    }

    function handleChangeUrl(event) {
        setAddedUrl(event.target.value);
    }
    function handleChangeUrlName(event) {
        setAddedUrlName(event.target.value);
    }
    let urlListRender = [];

    // eslint-disable-next-line array-callback-return
    urlList?.map((url, index) => {
        if (url.statusDelete === false) {
            urlListRender.push(
                <Url
                    url={url}
                    key={url.id}
                    index={index}
                    urlList={urlList}
                    component={component}
                    handleUrlDelete={handleUrlDelete}
                    updateUrlList={props.updateUrlList}
                />,
            );
        }
    });
    if (component === 'viewcomponent')
        return (
            <div className={style.urlBox}>
                {' '}
                <div className={style.title}>
                    <p>URL :</p>
                </div>{' '}
                <div className={style.urlrender}> {urlListRender}</div>
            </div>
        );
    return (
        <>
            {(component === 'editcomponent' ||
                component === 'newcomponent') && (
                <>
                    <div className={style.urlBox}>
                        <div className={style.title}>
                            <p>URL :</p>
                        </div>

                        <div className={style.inputContainer}>
                            <input
                                className={style.newUrl}
                                value={addedUrlName}
                                ref={props.urlRef}
                                onKeyDown={props.urlKeyDown}
                                type="text"
                                id="urlName"
                                name="urlName"
                                aria-label="Názov novej url adresy"
                                placeholder="Názov"
                                onChange={handleChangeUrlName}
                            />
                            <input
                                className={style.newUrl}
                                value={addedUrl}
                                ref={props.urlRef}
                                onKeyDown={props.urlKeyDown}
                                type="url"
                                id="url"
                                name="url"
                                aria-label="Nová url adresa"
                                placeholder="https://example.com"
                                onChange={handleChangeUrl}
                            />
                        </div>
                        {/* </div> */}

                        <div className={style.newUrlIcon} onClick={addURL}>
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                        </div>
                    </div>
                </>
            )}
            <div className={style.urlrender}> {urlListRender}</div>
        </>
    );
}
