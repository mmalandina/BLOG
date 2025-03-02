import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from '../../store/apiSlice';
import './Post.css';

const Post = ({ post }) => {
  const { token } = useSelector((state) => state.auth);
  const [favoriteArticle] = useFavoriteArticleMutation();
  const [unfavoriteArticle] = useUnfavoriteArticleMutation();

  const handleLike = () => {
    if (!token) return;
    if (post.favorited) {
      unfavoriteArticle(post.slug);
    } else {
      favoriteArticle(post.slug);
    }
  };

  const date = new Date(post.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <li className="post">
      <div className="post__info">
        <div className="post__header">
          <Link to={`/articles/${post.slug}`} className="post__title">
            {post.title}
          </Link>
          <div className="post__likes">
            <button
              className={`post__likes_button ${post.favorited && token ? 'active' : 'disable'}`}
              onClick={handleLike}
            ></button>
            <span className="post__likes_count">{post.favoritesCount}</span>
          </div>
        </div>
        <div className="post__author">
          <div className="post__author_container">
            <span className="username">{post.author.username}</span>
            <span className="date_created">{formattedDate}</span>
          </div>
          <img
            className="profile_photo"
            src={post.author.image}
            alt="profile"
          />
        </div>
        <ul className="post__tags">
          {post.tagList.map((tag) => (
            <li key={tag} className="post__tag">
              {tag}
            </li>
          ))}
        </ul>
        <p className="post__description">{post.description}</p>
      </div>
    </li>
  );
};

export default Post;

Post.propTypes = {
  post: PropTypes.shape({
    favorited: PropTypes.bool,
    slug: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    favoritesCount: PropTypes.number,
    description: PropTypes.string,
    tagList: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.shape({
      username: PropTypes.string.isRequired,
      image: PropTypes.string,
    }),
  }).isRequired,
};
