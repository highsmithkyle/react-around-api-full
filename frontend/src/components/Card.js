import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";



function Card({ card, onCardClick, onCardLike, onCardDelete }) {

    const currentUser = React.useContext(CurrentUserContext);
    const isOwn = card.owner._id === currentUser._id;
    const cardDeleteButtonClassName = `button elements__delete ${isOwn ? "elements__delete_visible" : "elements__delete_hidden"
        }`;

    const isLiked = card.likes.some((item) => item._id === currentUser._id);
    const cardLikeButtonClassName = `elements__heart ${isLiked ? "elements__heart_visible" : "elements__heart_hidden"
        }`;


    function handleClick() {
        onCardClick(card);
    }

    function handleLikeClick() {
        onCardLike(card)
    }

    function handleDeleteClick() {
        onCardDelete(card)
    }

    return (

        <li className="elements__container">

            <button
                className={cardDeleteButtonClassName}
                type="button"
                // className={cardDeleteButtonClassName}

                onClick={handleDeleteClick}

            />

            <img
                className="elements__image"
                src={card.link}
                alt={card.name}
                onClick={handleClick}
            />

            <div className="elements__text-container">
                <h2 className="elements__text">{card.name}</h2>
                <div className="elements__heart-container">
                    <button
                        className={cardLikeButtonClassName}
                        type="button"
                        onClick={handleLikeClick}

                    />
                    <p className="elements__text elements__heart-number">{card.likes.length}</p>
                </div>
            </div>
        </li>
    );
}

export default Card;