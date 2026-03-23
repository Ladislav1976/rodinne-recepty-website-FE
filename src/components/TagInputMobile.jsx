import { useState } from 'react';
import style from '../assets/styles/Components/TagInput.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Tag(props) {
    return (
        <div className={style.tag} onClick={props.onTagDelete}>
            <FontAwesomeIcon
                icon={faXmark}
                onClick={props.onTagDelete}
            ></FontAwesomeIcon>{' '}
            {props.tag.foodTag}
        </div>
    );
}

export default function TagInputMobile(props) {
    const [searchedTag, setSearchedTag] = useState('');

    const filterTagList = props.filterTagListState;

    function addSearchTagToTagList() {
        props.searchAddToTagList(searchedTag);
        setSearchedTag('');
        props.setModalFlag(false);
    }

    function handleChange(event) {
        setSearchedTag(event.target.value);
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            addSearchTagToTagList();
        }
    }

    function handleTagDelete(tag) {
        props.removeFromTagList(tag);
    }

    let tagListRender = [];

    for (const tag of filterTagList) {
        tagListRender.push(
            <Tag
                className={style.tagname}
                tag={tag}
                key={tag.id}
                onTagDelete={() => handleTagDelete(tag)}
            />,
        );
    }

    return (
        <>
            <div className={style.searchMain}>
                <div className={style.searchList}>{tagListRender}</div>
                {/* <div
                    className={style.searchonClickButton}
                    onClick={() => openModal()}
                > */}

                <div className={style.searchBoxMobile}>
                    <input
                        type="text"
                        className={style.searchInputMobile}
                        placeholder="Hľadať ..."
                        aria-label="Hľadať"
                        value={searchedTag}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                    />
                    <div
                        className={style.searchButtonMobile}
                        onClick={addSearchTagToTagList}
                    >
                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                    </div>
                </div>
                {/* </div> */}
            </div>
        </>
    );
}
