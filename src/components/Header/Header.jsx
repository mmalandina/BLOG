import React, { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import './Header.css';

const Header = () => {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/articles');
  };

  return (
    <header className="header">
      <Link to="/articles" className="header__title">
        Realworld Blog
      </Link>
      {token ? (
        <div className="header__buttons">
          <Link to="/new-article" className="header__buttons_new-article">
            Create article
          </Link>
          <Link to="/profile" className="header__profile">
            <span className="header__profile_username">{user?.username}</span>
            <img
              className="header__profile_image"
              src={user?.image || './noimg.svg'}
              alt="profile"
            />
          </Link>
          <button
            className="header__buttons_logout sign"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="header__buttons">
          <Link to="/sign-in" className="header__buttons_signin sign">
            Sign In
          </Link>
          <Link to="/sign-up" className="header__buttons_signup sign">
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
