import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateArticleMutation } from '../../store/apiSlice';
import { useNavigate } from 'react-router-dom';
import Tag from '../Tag';
import './CreateArticle.css';

const CreateArticle = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [tagList, setTagList] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [createArticle] = useCreateArticleMutation();
  const navigate = useNavigate();

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
    createArticle({ title, description, body: text, tagList })
      .unwrap()
      .then(() => {
        alert('Article created successfully!');
        navigate('/articles');
      })
      .catch((error) => {
        console.error('Error creating article', error);
        alert('Creation failed, please try again.');
      });
  };

  return (
    <article className="new-article">
      <h1 className="new-article__title">Create new article</h1>
      <form className="new-article__form" onSubmit={handleSubmit(onSubmit)}>
        <label className="new-article__form_item">
          Title
          <input
            className="title"
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
            className="description"
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
            className="text"
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

export default CreateArticle;
