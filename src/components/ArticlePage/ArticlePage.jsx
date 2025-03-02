import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Spin, Popconfirm } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetArticleQuery,
  useDeleteArticleMutation,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
  useGetUserQuery,
} from '../../store/apiSlice';
import { setUser } from '../../store/authSlice';
import './ArticlePage.css';

const ArticlePage = () => {
  const { slug } = useParams();
  const { token, user } = useSelector((state) => state.auth);
  const { data: article, isLoading, error } = useGetArticleQuery(slug);
  const { data: userData } = useGetUserQuery(undefined, { skip: !token });
  const dispatch = useDispatch();
  const [deleteArticle] = useDeleteArticleMutation();
  const [favoriteArticle] = useFavoriteArticleMutation();
  const [unfavoriteArticle] = useUnfavoriteArticleMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData.user));
    }
  }, [userData, dispatch]);

  if (isLoading)
    return (
      <div className="spinner-container">
        <Spin />
      </div>
    );
  if (error || !article) return <div>Article not found</div>;

  const handleLike = () => {
    if (!token) return;
    article.favorited ? unfavoriteArticle(slug) : favoriteArticle(slug);
  };

  const handleDelete = () => {
    deleteArticle(slug).then(() => navigate('/articles'));
  };

  const date = new Date(article.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="article">
      <div className="article__container">
        <div className="article__info">
          <div className="article__header">
            <h5 className="article__title">{article.title}</h5>
            <div className="article__likes">
              <button
                onClick={handleLike}
                className={`article__likes_button ${
                  article.favorited && token ? 'active' : 'disable'
                }`}
              ></button>
              <span className="article__likes_count">
                {article.favoritesCount}
              </span>
            </div>
          </div>
          <div className="article__author">
            <div className="article__author_container">
              <span className="username">{article.author.username}</span>
              <span className="date_created">{formattedDate}</span>
            </div>
            <img
              className="profile_photo"
              src={article.author.image || './noimg.svg'}
              alt="profile"
            />
          </div>
          <ul className="article__tags">
            {article.tagList.map((tag) => (
              <li key={tag} className="article__tag">
                {tag}
              </li>
            ))}
          </ul>
          <p className="article__description">{article.description}</p>
        </div>
        <div className="article__container_container">
          {token && user?.username === article.author.username && (
            <div className="article__buttons">
              <Popconfirm
                placement="rightTop"
                title="Are you sure you want to delete this article?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
                style={'height:104px'}
              >
                <button className="article__buttons_delete">Delete</button>
              </Popconfirm>
              <Link
                to={`/articles/${slug}/edit`}
                className="article__buttons_edit"
              >
                Edit
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="article__body">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {article.body}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default ArticlePage;
