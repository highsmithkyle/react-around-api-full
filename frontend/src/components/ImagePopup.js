import React from "react"

function ImagePopup(props) {

    return (

        <div
            className={`modal modal_type_image-expand ${props.selectedCard ? "modal_toggle" : ""
                }`}>

            <div className={`modal__box modal__box_type_image-expand`}>
                <button
                    className={`button modal__close-button modal__close-button_place_image-expand`}
                    type="button"
                    style={{ backgroundImage: `url(${props.closeButton})` }}
                    onClick={props.onClose}
                ></button>

                <img className="modal__image-preview"
                    src={`${props.selectedCard && props.selectedCard.link}`}
                    alt={`${props.selectedCard && props.selectedCard.name}`}
                />
                <div className="modal__image-subtitle">
                    {`${props.selectedCard && props.selectedCard.name}`}
                </div>
            </div>
        </div>
    )
}

export default ImagePopup;