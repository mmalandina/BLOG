import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateUserMutation } from '../../store/apiSlice';
import { setUser } from '../../store/authSlice';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      newPassword: '',
      image: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        image: user.image || '',
        newPassword: '',
      });
    }
  }, [user, reset]);

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const onSubmit = (data) => {
    const payload = {
      username: data.username,
      email: data.email,
      image: data.image,
    };
    if (data.newPassword) {
      payload.password = data.newPassword;
    }

    updateUser(payload)
      .unwrap()
      .then((response) => {
        dispatch(setUser(response.user));
        alert('Profile updated successfully!');
      })
      .catch((error) => {
        if (error.data?.errors) {
          Object.entries(error.data.errors).forEach(([field, message]) => {
            const errorMessage = Array.isArray(message)
              ? message.join(', ')
              : message;
            setError(field, { type: 'server', message: errorMessage });
          });
        } else {
          alert('Profile update failed.');
        }
      });
  };

  return (
    <div className="profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="profile__form">
        <label className="profile__form_item">
          Username
          <input
            type="text"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
              maxLength: {
                value: 20,
                message: 'Username must be at most 20 characters',
              },
              validate: (value) =>
                !/\s/.test(value) || 'Username must not contain spaces',
            })}
            className={`form-input ${errors.username ? 'input-error' : ''}`}
          />
          {errors.username && (
            <p className="error">{errors.username.message}</p>
          )}
        </label>
        <label className="profile__form_item">
          Email
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value:
                  /(^[a-z][a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/,
                message: 'Invalid email address',
              },
            })}
            className={`form-input ${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </label>
        <label className="profile__form_item">
          New Password
          <input
            type="password"
            {...register('newPassword', {
              validate: (value) => {
                if (value === '') return true;
                return (
                  (value.length >= 6 && value.length <= 40) ||
                  'New password must be between 6 and 40 characters'
                );
              },
            })}
            className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
          />
          {errors.newPassword && (
            <p className="error">{errors.newPassword.message}</p>
          )}
        </label>
        <label className="profile__form_item">
          Avatar image (url)
          <input
            type="url"
            {...register('image', {
              pattern: {
                value:
                  /^(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})$/,
                message: 'Invalid URL',
              },
            })}
            className={`form-input ${errors.image ? 'input-error' : ''}`}
          />
          {errors.image && <p className="error">{errors.image.message}</p>}
        </label>
        <button type="submit" className="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
