import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';

function EditProfilePopup(props) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name ?? '');
    setDescription(currentUser.about ?? '');
  }, [currentUser, props.isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      modalType={'edit'}
      modalTitle={'Edit Profile'}
      modalButtonText={'Save'}
      closeButton={props.closeButton}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        id="name-input"
        className="modal__info modal__info_place_name-input"
        type="text"
        value={name}
        onChange={handleNameChange}
        name="name"
        placeholder="Name"
        required
        minLength="2"
        maxLength="40"
      />
      <span id="name-input-error" className="modal__error"></span>

      <input
        id="about-input"
        className="modal__info modal__info_place_about-me-input"
        type="text"
        value={description}
        onChange={handleDescriptionChange}
        name="about"
        placeholder="Explorer"
        required
        minLength="2"
        maxLength="200"
      />
      <span id="about-input-error" className="modal__error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
