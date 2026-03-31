import style from '../assets/styles/components/FoodItem.module.css';

import { useNavigate } from 'react-router-dom';

import default_image from '../image/default_image1.jpg';

export default function FoodItem(props) {
    const navigate = useNavigate();

    const food = props.food;
    const id = props.food.id;
    const deletedPar = props.deletedPar;
    const params = new URLSearchParams({
        is_deleted: deletedPar,
    });

    return (
        <>
            {
                <div
                    className={style.foodcontainer}
                    onClick={() => navigate(`/recepty/${id}?${params.toString()}`)}
                >
                    <div
                        style={{
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <img
                            className={style.image}
                            loading="lazy"
                            src={food?.images || default_image}
                            alt="Nacitany obrazok"
                            onLoad={props.handleImgLoader}
                            onError={props.handleImgLoader}
                            style={{
                                border: deletedPar === 'true' ? '2px solid red' : '',
                            }}
                            key={food.images}
                        />
                        <div className={style.foodName}>{props.food.name}</div>
                    </div>
                </div>
            }
        </>
    );
}
