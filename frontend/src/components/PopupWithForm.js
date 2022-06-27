import React from 'react';

function PopupWithForm(props) {

    return (
        <div
            className={`modal modal_${props.modalType} ${props.isOpen && "modal_toggle"}`}
        >

            <div className={`modal__box modal__box_type_${props.modalType}`}>
                <button
                    className={`modal__close-button modal__close-button_type_${props.modalType} button`}
                    type="button"
                    style={{ backgroundImage: `url(${props.closeButton})` }}
                    onClick={props.onClose}
                ></button>

                <form className={`modal__form modal__form_type_${props.modalType}`}
                    name={`profile-form_type_${props.modalType}`}
                    onSubmit={props.onSubmit}
                >
                    <h2 className={`modal__title modal__title_type_${props.modalType}`}>
                        {props.modalTitle}
                    </h2>
                    {props.children}
                    <button className={`button modal__save-button modal__save-button_type_${props.modalType}`}
                        type="submit"
                    >
                        {props.modalButtonText}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PopupWithForm;