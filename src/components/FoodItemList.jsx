import FoodItem from './FoodItem';
import style from '../assets/styles/components/FoodItemList.module.css';

import PageButton from './PageButton';

export default function FoodItemList(props) {
    const foodItemListRender = [];
    const isMobile = props.isMobile;

    if (props.foods) {
        for (const food of props.foods) {
            foodItemListRender.push(
                <FoodItem
                    food={food}
                    key={food.id}
                    handleImgLoader={props.handleImgLoader}
                    location={props.location}
                    deletedPar={props.deletedPar}
                />
            );
        }
    }

    const page = props.page;

    const foodsQf = props.foodsQf;
    const pagesArray = Array(foodsQf?.data?.TotalNumOfPages)
        .fill()
        .map((_, index) => index + 1);
    return (
        <>
            <div className={style.foodItemBox}>
                <div className={style.foodItemList}>{foodItemListRender}</div>

                {!isMobile && (
                    <div className={style.paginationBox}>
                        <nav className={style.navigationbar}>
                            <button
                                className={style.button}
                                onClick={() => props.pageChange(page - 1)}
                                disabled={!foodsQf?.data?.previous || page === 1}
                                id={
                                    !foodsQf?.data?.previous || page === 1
                                        ? style['buttondisabled']
                                        : style['buttonenabled']
                                }
                            >
                                &lt;&lt;
                            </button>
                            {pagesArray.map((pg) => (
                                <PageButton
                                    key={pg}
                                    pg={pg}
                                    page={page}
                                    pageChange={props.pageChange}
                                />
                            ))}
                            <button
                                className={style.button}
                                onClick={() => props.pageChange(page + 1)}
                                disabled={page === foodsQf?.data?.TotalNumOfPages}
                                id={
                                    page === foodsQf?.data?.TotalNumOfPages
                                        ? style['buttondisabled']
                                        : style['buttonenabled']
                                }
                            >
                                &gt;&gt;
                            </button>
                        </nav>
                        <div className={style.navdisplay}>
                            ({foodsQf?.data?.FirstItemsOnPage} - {foodsQf?.data?.LastItemsOnPage}) z{' '}
                            {foodsQf?.data?.TotalItems}
                            <select
                                className={style.pageSize}
                                onChange={(e) => props.pageSizeChange(e)}
                                value={props.pageSize}
                            >
                                <option>2</option>
                                <option>4</option>
                                <option>6</option>
                                <option>8</option>
                                <option>20</option>
                                <option>30</option>
                                <option>40</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
