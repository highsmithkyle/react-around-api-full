import React, { useState, useEffect } from 'react';
import { Route, Redirect, Routes, Navigate, useNavigate, Switch } from 'react-router-dom';
import { register, authorize, checkToken } from '../utils/auth';
import {auth} from '../utils/auth';
import api from '../utils/api';
import ProtectedRoute from './ProtectedRoute';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


import { useHistory } from "react-router-dom"


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

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const [toolTipStatus, setToolTipStatus] = React.useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setIsLoggedIn] = React.useState(false);
  const [status, setStatus] = React.useState(true);

  
  const history = useHistory();
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token && loggedIn) {
      api
        .getAppInfo(token)
        .then(([CardData, userData]) => {
          setCurrentUser(userData);
          setCards(CardData);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

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

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((cardId) => cardId === currentUser._id);
    api
      .changeLikeStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((card) => (card._id === card._id ? newCard : card))
        );
      })
      .catch((err) => {
        console.log(
          'An error occured while liking the card'
        );
        console.log(err);
      });
  };

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((item) => item._id !== card._id));
      })
      .catch((error) => console.log(error));
  }


  function handleUpdateUser(userData) {
    api
      .changeProfileInfo(userData)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((error) => console.error(error));
  }

  function handleUpdateAvatar(userData) {
    api
      .changeProfileAvatar(userData)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((error) => console.error(error));
  }

  function handleAddPlaceSubmit(card) {
    api
      .createCard(card, localStorage.getItem('jwt'))
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
          const userData = {
            email,
            password,
          };
          onLogin(userData);
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
    setTooltipOpen(false);
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
          {LoggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
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
        isOpen={isTooltipOpen}
        closeButton={closeButton}
        status={toolTipStatus}
        onClose={closeAllPopups}
      />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
