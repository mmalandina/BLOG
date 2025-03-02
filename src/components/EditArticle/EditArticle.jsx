import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import {
  useGetArticleQuery,
  useEditArticleMutation,
} from '../../store/apiSlice';
import Tag from '../Tag';

const EditArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: article, isLoading, error } = useGetArticleQuery(slug);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [tagList, setTagList] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [editArticle] = useEditArticleMutation();

  useEffect(() => {
    if (article) {
      setValue('title', article.title);
      setValue('description', article.description);
      setValue('text', article.body);
      setTagList(article.tagList);
    }
  }, [article, setValue]);

  const addTag = (e) => {
    e.preventDefault();
    if (newTag && !tagList.includes(newTag)) {
      setTagList([...tagList, newTag]);
    } else {
      alert('Tag already exists!');
    }
    setNewTag('');
  };

  const deleteTag = (tagToDelete) => {
    setTagList(tagList.filter((tag) => tag !== tagToDelete));
  };

  const onSubmit = (data) => {
    const { title, description, text } = data;
    editArticle({ slug, title, description, body: text, tagList })
      .unwrap()
      .then(() => {
        alert('Article updated successfully!');
        navigate(`/articles/${slug}`);
      })
      .catch((error) => {
        console.error('Error updating article', error);
        alert('Update failed, please try again.');
      });
  };

  if (isLoading)
    return (
      <div className="spinner-container">
        <Spin />
      </div>
    );
  if (error || !article) return <div>Article not found</div>;

  return (
    <article className="new-article">
      <h1 className="new-article__title">Edit article</h1>
      <form className="new-article__form" onSubmit={handleSubmit(onSubmit)}>
        <label className="new-article__form_item">
          Title
          <input
            type="text"
            placeholder="Title"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="error_message">{errors.title.message}</p>
          )}
        </label>
        <label className="new-article__form_item">
          Short description
          <input
            type="text"
            placeholder="Short description"
            {...register('description', {
              required: 'Short description is required',
            })}
          />
          {errors.description && (
            <p className="error_message">{errors.description.message}</p>
          )}
        </label>
        <label className="new-article__form_item">
          Text
          <textarea
            placeholder="Text"
            {...register('text', { required: 'Text is required' })}
          />
          {errors.text && (
            <p className="error_message">{errors.text.message}</p>
          )}
        </label>
        <div className="new-article__form_item tags">
          Tags
          <div className="new-article__form_tags_container">
            {tagList.map((tag) => (
              <Tag key={tag} tag={tag} onDelete={() => deleteTag(tag)} />
            ))}
            <div className="new-article__form_tags_container_tag">
              <input
                className="new-article__form_item_input tag"
                placeholder="Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button type="button" className="new-article__form_tags_delete">
                Delete
              </button>
              <button
                type="button"
                className="new-article__form_tags_add"
                onClick={addTag}
              >
                Add tag
              </button>
            </div>
          </div>
        </div>
        <button type="submit" className="new-article__form_submit">
          Send
        </button>
      </form>
    </article>
  );
};

export default EditArticle;
