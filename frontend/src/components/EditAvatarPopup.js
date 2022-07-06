import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {
  const avatarRef = React.useRef();

  React.useEffect(() => {
    avatarRef.current.value = '';
  }, [props.isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      modalType={'avatar'}
      modalTitle={'Edit profile picture'}
      modalButtonText={'Change'}
      closeButton={props.closeButton}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        ref={avatarRef}
        id="link-avatar-input"
        className="modal__info modal__info_place_url-input"
        type="url"
        name="avatar"
        placeholder="Image link"
        required
      />
      <span id="link-avatar-input-error" className="modal__error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
