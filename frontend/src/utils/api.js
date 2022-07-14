class Api {
  constructor(props) {
    this.baseUrl = props.baseUrl;
    this.headers = props.headers;
  }

  getProfile() {
    return fetch(`${this.baseUrl}/users/me`, {
      headers: this.headers,
    }).then((res) => this._checkErrors(res));
  }

  _checkErrors(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error ${res.status}`);
  }

  getInitialProfile() {
    return fetch(`${this.baseUrl}/users/me`, {
      headers: this.headers,
    }).then((res) => this._checkErrors(res));
  }

  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, {
      headers: this.headers,
    }).then((res) => this._checkErrors(res));
  }

  createCard({ name, link }) {
    return fetch(`${this.baseUrl}/cards`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ name, link }),
    }).then((res) => this._checkErrors(res));
  }

  changeProfileInfo({ name, about }) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({ name: name, about: about }),
    }).then((res) => this._checkErrors(res));
  }

  changeProfileAvatar({ avatar }) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({ avatar: avatar }),
    }).then((res) => this._checkErrors(res));
  }

  likeCard(cardId, isLiked) {
    const method = isLiked ? 'DELETE' : 'PUT';
    return fetch(`${this.baseUrl}/cards/likes/${cardId}`, {
      method: method,
      headers: this.headers,
    }).then((res) => this._checkErrors(res));
  }

  deleteCard(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this.headers,
    }).then((res) => this._checkErrors(res));
  }
}

const api = new Api({
  baseUrl: 'https://around.nomoreparties.co/v1/group-12',
  headers: {
    // authorization: 'f4ba53cb-c4b1-4360-b78c-98b41af44bf6',
    authorization: `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  },
});

export default api;
