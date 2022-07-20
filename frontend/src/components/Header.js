import React from 'react';
import logo from '../images/newlogo.png';
import { Route, Link } from 'react-router-dom';

function Header({ onSignOut, email }) {
  function handleSignOut() {
    onSignOut();
  }

  return (
    <header className="header">
      <img src={logo} alt="logo Practicum" className="header__logo" />
      <Route exact path="/">
        <div className="header__data">
          <p className="header__user_email">{email}</p>
          <button className="header__link__logout" onClick={handleSignOut}>
            Log out
          </button>
        </div>
      </Route>
      <Route path="/signup">
        <Link className="header__link" to="signin">
          Login
        </Link>
      </Route>
      <Route path="/signin">
        <Link className="header__link" to="signup">
          Sign up
        </Link>
      </Route>
    </header>
  );
}

export default Header;

// import logo from '../images/newlogo.png';
// import { Link, useLocation } from 'react-router-dom';

// function Header({ loggedIn, handleLogout, user }) {
//   const location = useLocation();

//   return (
//     <header className="header">
//       <img
//         className="header__logo"
//         src={logo}
//         alt="Around the
//         World"
//       />
//       {loggedIn ? (
//         <div className={`header__data`}>
//           <p className="header__user_email">{loggedIn && user}</p>
//           <Link
//             to={'/signin'}
//             className={`header__link header__link__logout`}
//             onClick={loggedIn && handleLogout}
//           >
//             Log out
//           </Link>{' '}
//         </div>
//       ) : (
//         <div className={`header__data`}>
//           <Link
//             to={location.pathname === '/signin' ? '/signup' : '/signin'}
//             className={`header__link`}
//             onClick={loggedIn && handleLogout}
//           >
//             {location.pathname === '/signin' ? 'Sign up' : 'Sign in'}
//           </Link>
//         </div>
//       )}
//     </header>
//   );
// }

// export default Header;
