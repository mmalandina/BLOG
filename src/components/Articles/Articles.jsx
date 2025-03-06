import React, { useState } from 'react';
import { useGetArticlesQuery } from '../../store/apiSlice';
import Post from '../Post';
import { Spin, Pagination } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import './Articles.css';

const Articles = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data, error, isLoading } = useGetArticlesQuery(currentPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`?page=${page}`);
  };

  if (isLoading)
    return (
      <div className="spinner-container">
        <Spin />
      </div>
    );
  if (error) return <div>Error loading articles.</div>;

  const articles = data.articles;
  const totalArticles = data.articlesCount;

  return (
    <div className="articles">
      <ul className="list-articles">
        {articles.map((article) => (
          <Post key={article.slug} post={article} />
        ))}
      </ul>
      <Pagination
        current={currentPage}
        total={totalArticles}
        showSizeChanger={false}
        pageSize={5}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default Articles;
