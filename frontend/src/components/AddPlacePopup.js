import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {
  const [title, setTitle] = React.useState('');
  const [link, setLink] = React.useState('');

  React.useEffect(() => {
    setTitle('');
    setLink('');
  }, [props.onClose]);

  function handleTitleChange(e) {
    setTitle(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.onAddPlaceSubmit({
      name: title,
      link,
    });
  }

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      modalType={'add'}
      modalTitle={'New Place'}
      modalButtonText={'Create'}
      closeButton={props.closeButton}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        value={title}
        onChange={handleTitleChange}
        id="add-card-title"
        className="modal__info modal__info_place_new-title-input"
        type="text"
        name="name"
        placeholder="Title"
        required
        minLength="1"
        maxLength="30"
      />
      <span id="add-card-title-error" className="modal__error"></span>

      <input
        value={link}
        id="add-card-url"
        onChange={handleLinkChange}
        className="modal__info modal__info_place_url-input"
        type="url"
        name="link"
        placeholder="Image Link"
        required
      />
      <span id="add-card-url-error" className="modal__error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
