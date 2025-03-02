import { useState } from 'react';
import { useGetArticlesQuery } from '../../store/apiSlice';
import Post from '../Post';
import { Spin, Pagination } from 'antd';
import './Articles.css';

const Articles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isLoading } = useGetArticlesQuery(currentPage);

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
        onChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default Articles;
