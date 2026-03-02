import style from '../assets/styles/Components/PageButton.module.css';

function PageButton(props) {
    const page = props.page;
    const pg = props.pg;

    return (
        <button
            className={pg === page ? style.buttoncurrentpage : style.button}
            onClick={() => props.pageChange(pg)}
        >
            {pg}
        </button>
    );
}

export default PageButton;
