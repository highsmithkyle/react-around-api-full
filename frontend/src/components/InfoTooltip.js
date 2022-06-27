import React from 'react';
import successIcon from '../images/success.gif';
import errorIcon from '../images/error.gif';
import closeButton from '../images/close-button.svg';

function InfoTooltip(props) {
  return (
    <div
      className={`modal modal_type_infotooltip ${
        props.isOpen && 'modal_toggle'
      }`}
    >
      <div className={`modal__box modal__box_type_infotooltip`}>
        {props.status === 'success' ? (
          <div className="infotooltip">
            <img
              src={successIcon}
              alt="Success icon"
              className="infotooltip__icon"
            ></img>
            <p className="infotooltip__text">
              Success! You have now been registered.
            </p>
          </div>
        ) : (
          <div className="infotooltip">
            <img
              src={errorIcon}
              alt="Failed icon"
              className="infotooltip__icon"
            ></img>
            <p className="infotooltip__text">
              Oops, something went wrong! Please try again.
            </p>
          </div>
        )}
        <button
          className={`modal__close-button`}
          type="button"
          style={{ backgroundImage: `url(${closeButton})` }}
          onClick={props.onClose}
        />
      </div>
    </div>
  );
}

export default InfoTooltip;
