import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Header from '../Header/Header';
import Articles from '../Articles';
import ArticlePage from '../ArticlePage/ArticlePage';
import SignUp from '../SignUp/SignUp';
import SignIn from '../SignIn/SignIn';
import Profile from '../Profile/Profile';
import CreateArticle from '../CreateArticle';
import EditArticle from '../EditArticle';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/sign-in" />;
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Articles />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route
            path="/articles/:slug/edit"
            element={
              <PrivateRoute>
                <EditArticle />
              </PrivateRoute>
            }
          />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/new-article"
            element={
              <PrivateRoute>
                <CreateArticle />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
