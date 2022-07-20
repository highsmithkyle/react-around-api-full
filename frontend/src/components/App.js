import React, { useState, useEffect } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import auth from '../utils/auth';
import api from '../utils/api';
import ProtectedRoute from './ProtectedRoute';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ImagePopup from './ImagePopup';
import closeButton from '../images/close-button.svg';
import { useHistory } from 'react-router-dom';

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [toolTipStatus, setToolTipStatus] = React.useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const [isInfoToolTipOpen, setisInfoToolTipOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const history = useHistory();

  React.useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token && isLoggedIn) {
      api
        .getAppInfo(token)
        .then(([CardData, userData]) => {
          setCurrentUser(userData);
          setCards(CardData);
        })
        .catch((err) => console.log(err));
    }
  }, [isLoggedIn]);

  React.useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          if (res) {
            setEmail(res.email);
            setIsLoggedIn(true);
            history.push('/');
          } else {
            localStorage.removeItem('jwt');
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((cardId) => {
      // console.log(cardId === currentUser._id);
      // console.log(cardId[0]);
      // console.log(currentUser._id);
      return cardId[0] === currentUser._id;
    });
    // console.log(!isLiked);
    // console.log(currentUser);
    // console.log(card.likes);
    api
      .changeLikeStatus(card._id, !isLiked, localStorage.getItem('jwt'))
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c)),
        );
      })
      .catch((err) => {
        // console.log('An error occured while liking the card');
        console.log(err);
      });
  };

  function handleCardDelete(card) {
    api
      .deleteCard(card._id, localStorage.getItem('jwt'))
      .then(() => {
        setCards((cards) => cards.filter((item) => item._id !== card._id));
      })
      .catch((error) => console.log(error));
  }

  function handleUpdateUser({ name, about }) {
    api
      .editUserInfo({ name, about }, localStorage.getItem('jwt'))
      .then((res) => {
        setCurrentUser(res.data);
        closeAllPopups();
      })
      .catch((error) => console.error(error));
  }

  function handleUpdateAvatar(avatar) {
    api
      .updateAvatar({ avatar }, localStorage.getItem('jwt'))
      .then((res) => {
        setCurrentUser(res.data);
        closeAllPopups();
      })
      .catch((error) => console.error(error));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addNewCard(newCard, localStorage.getItem('jwt'))
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => console.error(error));
  }

  function onRegister({ email, password }) {
    auth
      .register({ email, password })
      .then((res) => {
        if (res.data._id) {
          setToolTipStatus('success');
          setisInfoToolTipOpen(true);
          // const userData = {
          //   email,
          //   password,
          // };
          // onLogin(userData);
          history.push('/login');
        } else {
          setToolTipStatus('fail');
          setisInfoToolTipOpen(true);
        }
      })
      .catch((err) => {
        setToolTipStatus('fail');
        setisInfoToolTipOpen(true);
      });
  }

  function onLogin({ email, password }) {
    auth
      .login({ email, password })
      .then((res) => {
        if (res.token) {
          localStorage.setItem('jwt', res.token);
          setIsLoggedIn(true);
          setEmail(email);
          history.push('/');
        } else {
          setToolTipStatus('fail');
          setisInfoToolTipOpen(true);
        }
      })
      .catch((err) => {
        setToolTipStatus('fail');
        setisInfoToolTipOpen(true);
      });
  }

  function onSignOut() {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    history.push('/signin');
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setisInfoToolTipOpen(false);
  }

  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };
    document.addEventListener('keydown', closeByEscape);
    return () => document.removeEventListener('keydown', closeByEscape);
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={email} onSignOut={onSignOut} />
        <Switch>
          <ProtectedRoute exact path="/" loggedIn={isLoggedIn}>
            <Main
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditAvatarClick={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
            />
          </ProtectedRoute>
          <Route path="/signup">
            <Register onRegister={onRegister} />
          </Route>
          <Route path="/signin">
            <Login onLogin={onLogin} />
          </Route>
          <Route>
            {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>
        </Switch>
        <Footer />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onUpdateAvatar={handleUpdateAvatar}
          closeButton={closeButton}
          onClose={closeAllPopups}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          closeButton={closeButton}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          closeButton={closeButton}
          onAddPlaceSubmit={handleAddPlaceSubmit}
        />
        <PopupWithForm
          modalType={'delete'}
          modalTitle={'Are you sure?'}
          modalButtonText={'Yes'}
          closeButton={closeButton}
        />
        <ImagePopup
          closeButton={closeButton}
          selectedCard={selectedCard}
          onClose={closeAllPopups}
        />

        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          closeButton={closeButton}
          status={toolTipStatus}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
