import React from 'react';
import { Link } from 'react-router-dom';

function Register({ handleRegistrationSubmit }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegistrationSubmit(email, password);
    console.log(n);
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <div className="login__content">
          <h3 className="login__title">Sign up</h3>
          <input
            className="login__input"
            name="name"
            placeholder="Email"
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="login__input"
            name="password"
            placeholder="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="login__content">
          <button className="login__button" type="submit">
            Sign up
          </button>
          <p className="login__text">
            Already a member?{' '}
            <Link className="login__link" to="/signin">
              Log in here!
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
