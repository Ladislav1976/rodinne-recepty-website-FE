import style from '../assets/styles/components/UrlInput.module.css';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck, faXmark, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';

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
                                style={{
                                    fontWeight: !props.is_deleted
                                        ? ''
                                        : props.deleted_at === url.deleted_at
                                          ? 'bold'
                                          : '',
                                    textDecoration: !props.is_deleted
                                        ? ''
                                        : props.deleted_at === url.deleted_at
                                          ? 'underline'
                                          : '',
                                }}
                            >
                                {props.url.urlname}
                            </a>{' '}
                        </div>
                    </div>
                </>
            )}

            {(props.component === 'editcomponent' || props.component === 'newcomponent') && (
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
                            name="url"
                            aria-label="Existujúca url adresa webovej stránky"
                            size={1000}
                            onChange={handleUpdateUrl}
                        />
                    </div>
                    <div className={style.iconBox}>
                        <div className={isChanged ? style.editIcon : style.OKIcon}>
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
                            <div className={style.cancelIcon} datatooltip="Zrušiť">
                                <FontAwesomeIcon icon={faXmark} onClick={() => handleCancelUrl()} />
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
    const [inputNewUrlIsVisible, setInputNewUrlIsVisible] = useState(false);
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
            props.handlerSetModalErrorMissing('Neplatný formát! Adresa musí začínať s "https://');
            return;
        }

        props.handleAddUrl(
            {
                id: uniqueID,
                url: addedUrl,

                urlname: addedUrlName,
                statusDelete: false,
            },
            urlList
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

    return (
        <>
            <div className={style.urlBox}>
                <div className={style.title}>
                    <p>URL :</p>
                </div>{' '}
                {(component === 'editcomponent' || component === 'newcomponent') && (
                    <>
                        {component === 'editcomponent' && !inputNewUrlIsVisible && (
                            <div
                                className={style.newUrlInputVisible}
                                onClick={() => setInputNewUrlIsVisible(true)}
                            >
                                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                            </div>
                        )}
                        {(component === 'newcomponent' ||
                            (component === 'editcomponent' && inputNewUrlIsVisible)) && (
                            <>
                                <div className={style.inputContainer}>
                                    <input
                                        className={style.newUrl}
                                        value={addedUrlName}
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
                                        type="url"
                                        id="url"
                                        name="url"
                                        aria-label="Nová url adresa"
                                        placeholder="https://example.com"
                                        onChange={handleChangeUrl}
                                    />
                                </div>{' '}
                                <div className={style.newUrlAdd} onClick={addURL}>
                                    <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                </div>
                            </>
                        )}
                    </>
                )}{' '}
            </div>
            <div className={style.urlrender}>
                {(urlList || [])
                    .filter((a) => a.statusDelete === false)
                    .map((url, index) => {
                        return (
                            <Url
                                url={url}
                                key={url.id}
                                index={index}
                                urlList={urlList}
                                component={component}
                                handleUrlDelete={handleUrlDelete}
                                updateUrlList={props.updateUrlList}
                                is_deleted={props.is_deleted}
                                deleted_at={props.deleted_at}
                            />
                        );
                    })}
            </div>
        </>
    );
}
