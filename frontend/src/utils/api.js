class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _handleServerResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  getAppInfo(token) {
    return Promise.all([this.getInitialCards(token), this.getUserInfo(token)]);
  }

  getInitialCards(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._handleServerResponse);
  }

  getUserInfo(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._handleServerResponse);
  }

  editUserInfo({ name, about }, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._handleServerResponse);
  }

  addNewCard({ name, link }, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._handleServerResponse);
  }

  deleteCard(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._handleServerResponse);
  }

  changeLikeStatus(cardId, isLiked, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._handleServerResponse);
  }

  updateAvatar({ avatar }, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
      body: JSON.stringify({ avatar }),
    }).then(this._handleServerResponse);
  }
}

const api = new Api({
  baseUrl: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

// class Api {
//   constructor(props) {
//     this.baseUrl = props.baseUrl;
//     this.headers = props.headers;
//   }

//   getProfile() {
//     return fetch(`${this.baseUrl}/users/me`, {
//       headers: this.headers,
//     }).then((res) => this._checkErrors(res));
//   }

//   _checkErrors(res) {
//     if (res.ok) {
//       return res.json();
//     }
//     return Promise.reject(`Error ${res.status}`);
//   }

//   getInitialProfile() {
//     return fetch(`${this.baseUrl}/users/me`, {
//       headers: this.headers,
//     }).then((res) => this._checkErrors(res));
//   }

//   getInitialCards() {
//     return fetch(`${this.baseUrl}/cards`, {
//       headers: this.headers,
//     }).then((res) => this._checkErrors(res));
//   }

//   createCard({ name, link }) {
//     return fetch(`${this.baseUrl}/cards`, {
//       method: 'POST',
//       headers: this.headers,
//       body: JSON.stringify({ name, link }),
//     }).then((res) => this._checkErrors(res));
//   }

//   changeProfileInfo({ name, about }) {
//     return fetch(`${this.baseUrl}/users/me`, {
//       method: 'PATCH',
//       headers: this.headers,
//       body: JSON.stringify({ name: name, about: about }),
//     }).then((res) => this._checkErrors(res));
//   }

//   changeProfileAvatar({ avatar }) {
//     return fetch(`${this.baseUrl}/users/me/avatar`, {
//       method: 'PATCH',
//       headers: this.headers,
//       body: JSON.stringify({ avatar: avatar }),
//     }).then((res) => this._checkErrors(res));
//   }

//   likeCard(cardId, isLiked) {
//     const method = isLiked ? 'DELETE' : 'PUT';
//     return fetch(`${this.baseUrl}/cards/likes/${cardId}`, {
//       method: method,
//       headers: this.headers,
//     }).then((res) => this._checkErrors(res));
//   }

//   deleteCard(cardId) {
//     return fetch(`${this.baseUrl}/cards/${cardId}`, {
//       method: 'DELETE',
//       headers: this.headers,
//     }).then((res) => this._checkErrors(res));
//   }
// }

// const api = new Api({
//   baseUrl: 'https://around.nomoreparties.co/v1/group-12',
//   headers: {
//     // authorization: 'f4ba53cb-c4b1-4360-b78c-98b41af44bf6',
//     authorization: `Bearer ${localStorage.getItem('jwt')}`,
//     'Content-Type': 'application/json',
//   },
// });

// export default api;
