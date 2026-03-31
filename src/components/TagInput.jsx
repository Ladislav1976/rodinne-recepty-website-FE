import { useState } from 'react';
import style from '../assets/styles/components/TagInput.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Tag(props) {
    return (
        <div className={style.tag} onClick={props.onTagDelete}>
            <FontAwesomeIcon icon={faXmark} onClick={props.onTagDelete}></FontAwesomeIcon>{' '}
            {props.tag.foodTag}
        </div>
    );
}

export default function TagInput(props) {
    const [searchedTag, setSearchedTag] = useState('');
    const setModalFlag = props.setModalFlag;
    const filterTagList = props.filterTagListState;
    let tagListRender = [];

    function addSearchTagToTagList() {
        props.searchAddToTagList(searchedTag);
        setSearchedTag('');
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

    function openModal() {
        setModalFlag(true);
    }

    for (const tag of filterTagList) {
        tagListRender.push(
            <Tag
                className={style.tagname}
                tag={tag}
                key={tag.id}
                onTagDelete={() => handleTagDelete(tag)}
            />
        );
    }

    return (
        <>
            <div className={style.searchMain}>
                <div className={style.searchList}>{tagListRender}</div>

                <div className={style.searchBox}>
                    <div className={style.searchonClickButton} onClick={openModal}></div>{' '}
                    <input
                        type="text"
                        className={style.searchInput}
                        placeholder="Hľadať ..."
                        aria-label="Hľadať"
                        value={searchedTag}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                    />
                    <div className={style.searchButton} onClick={addSearchTagToTagList}>
                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                    </div>
                </div>
            </div>
        </>
    );
}
