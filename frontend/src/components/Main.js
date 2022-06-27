import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';
import editButton from '../images/edit-button.svg';
import addButton from '../images/add-button.svg';

function Main({
  onEditAvatarClick,
  onEditProfileClick,
  onAddPlaceClick,
  onCardClick,
  cards,
  onCardDelete,
  onCardLike,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar">
          <div className="profile__elipse">
            <img
              className="profile__image"
              src={currentUser.avatar}
              alt={currentUser.name}
            />
            <button
              className="button profile__avatar-button"
              type="button"
              onClick={onEditAvatarClick}
              style={{ backgroundImage: `url(${editButton})` }}
            ></button>
          </div>
        </div>
        <div className="profile__info">
          <div className="profile__name-container">
            <h1 className="profile__title">{currentUser.name}</h1>
            <button
              className="profile__edit-button"
              type="button"
              style={{ backgroundImage: `url(${editButton})` }}
              onClick={onEditProfileClick}
            ></button>
          </div>
          <p className="profile__subtitle">{currentUser.about}</p>
        </div>
        <button
          className="profile__add-button"
          id="profile-add-button"
          type="button"
          style={{ backgroundImage: `url(${addButton})` }}
          onClick={onAddPlaceClick}
        ></button>
      </section>

      <section className="elements">
        {cards.map((card) => {
          return (
            <Card
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          );
        })}
      </section>
    </main>
  );
}

export default Main;
