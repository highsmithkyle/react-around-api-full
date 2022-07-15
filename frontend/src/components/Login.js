import React from 'react';
import { Link } from 'react-router-dom';

function Login({ handleLoginSubmit }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginSubmit(email, password);
    debugger;
    console.log(n);
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <div className="login__content">
          <h3 className="login__title">Log in</h3>
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
            Log in
          </button>
          <p className="login__text">
            Not a member yet?{' '}
            <Link className="login__link" to="/signup">
              Sign up here!
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
