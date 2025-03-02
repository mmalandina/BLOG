import React from 'react';
import './Tag.css';
import PropTypes from 'prop-types';

const Tag = ({ tag, onDelete }) => {
  return (
    <div className="new-article__form_tags_container_tag">
      <span className="new-article__form_item_input tag">{tag}</span>
      <button
        type="button"
        className="new-article__form_tags_delete"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default Tag;

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};
