import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { register, authorize, checkToken } from '../utils/auth';
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

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [status, setStatus] = React.useState(true);

  const navigate = useNavigate();

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    navigate('/signin');
  };

  useEffect(() => {
    api
      .getInitialCards()
      .then((data) => {
        setCards(data);
      })
      .catch((error) => console.error(error));

    handleTokenCheck();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    api
      .getInitialProfile()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((error) => console.error(error));
  }, []);

  function handleTokenCheck() {
    if (localStorage.getItem('jwt')) {
      const jwt = localStorage.getItem('jwt');
      checkToken(jwt)
        .then((res) => {
          if (res) {
            handleLogin();
            navigate('/');
          } else {
            localStorage.removeItem('jwt');
          }
        })
        .catch((err) => {
          if (err === 400) {
            console.log('Token not provided or provided in the wrong format');
          } else if (err === 401) {
            console.log('The provided token is invalid ');
          }
        });
    }
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((item) => item._id === currentUser._id);
    api
      .likeCard(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((item) => (item._id === card._id ? newCard : item)),
        );
      })
      .catch((error) => console.error(error));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards(cards.filter((item) => item !== card));
      })
     .catch((error) => console.error(error));
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
      .createCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => console.error(error));
  }

  const handleRegistrationSubmit = (email, password) => {
    // debugger;
    register(email, password)
      .then((res) => {
        if (res.data._id) {
          console.log('res OK');
          setStatus('success');
          navigate('/signin');
        } else {
          console.log('Something went wrong');
          setStatus('failed');
        }
      })
      .catch((err) => {
        if (err === 400) {
          console.log('One of the fields was filled in incorrectly');
        } else {
          console.log(err);
        }
        setStatus('failed');
      })
      .finally(() => {
        setTooltipOpen(true);
      });
  };

  const handleLoginSubmit = (email, password) => {
    authorize(email, password)
      .then((res) => {
        if (res.token) {
          handleLogin();
          navigate('/');
        }
      })
      .catch((err) => {
        if (err === 400) {
          console.log('One or more of the fields were not provided');
        } else if (err === 401) {
          console.log(
            'the user with the specified email or password was not found',
          );
        }
        setStatus('failed');
        setTooltipOpen(true);
      });
  };

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
      <Header
        handleLogout={handleLogout}
        user={localStorage.email}
        loggedIn={loggedIn}
      />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Main
                onEditAvatarClick={handleEditAvatarClick}
                onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleAddPlaceClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signin"
          element={<Login handleLoginSubmit={handleLoginSubmit} />}
        ></Route>
        <Route
          path="/signup"
          element={
            <Register handleRegistrationSubmit={handleRegistrationSubmit} />
          }
        ></Route>
        <Route
          path="*"
          element={
            loggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
      </Routes>
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
        closeButtons={closeButton}
        status={status}
        onClose={closeAllPopups}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
