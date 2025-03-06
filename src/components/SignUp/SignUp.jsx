import React from 'react';
import { useForm } from 'react-hook-form';
import { useRegisterUserMutation } from '../../store/apiSlice';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const password = watch('password');

  const onSubmit = (data) => {
    const { username, email, password } = data;
    registerUser({ username, email, password })
      .unwrap()
      .then(() => {
        alert('User registered successfully!');
      })
      .catch((error) => {
        if (error.data?.errors) {
          Object.entries(error.data.errors).forEach(([field, messages]) => {
            setError(field, { type: 'server', message: messages.join(', ') });
          });
        } else {
          setError('root', {
            type: 'server',
            message: 'Registration failed. Please try again.',
          });
        }
      });
  };

  return (
    <div className="signup">
      <h2>Create new account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="signup__form">
        <label className="signup__form_item">
          Username
          <input
            type="text"
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'Minimum 3 characters' },
              maxLength: { value: 20, message: 'Maximum 20 characters' },
            })}
            className={errors.username ? 'input-error' : ''}
          />
          {errors.username && (
            <p className="error">{errors.username.message}</p>
          )}
        </label>
        <label className="signup__form_item">
          Email
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value:
                  /(^[a-z][a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/,
                message: 'Invalid email',
              },
            })}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </label>
        <label className="signup__form_item">
          Password
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' },
              maxLength: { value: 40, message: 'Maximum 40 characters' },
            })}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </label>
        <label className="signup__form_item">
          Repeat Password
          <input
            type="password"
            {...register('repeatPassword', {
              required: 'Repeat password is required',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
            className={errors.repeatPassword ? 'input-error' : ''}
          />
          {errors.repeatPassword && (
            <p className="error">{errors.repeatPassword.message}</p>
          )}
        </label>
        <label className="signup__form_item signup__checkbox">
          <input
            type="checkbox"
            {...register('agreeToTerms', {
              required:
                'You must agree to the processing of your personal data',
            })}
            className={errors.agreeToTerms ? 'input-error' : ''}
          />
          I agree to the processing of my personal information
        </label>
        {errors.agreeToTerms && (
          <p className="error input-error_terms">
            {errors.agreeToTerms.message}
          </p>
        )}
        {errors.root && <p className="error">{errors.root.message}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create'}
        </button>
        <p className="link__description">
          Already have an account?{' '}
          <Link to="/sign-in" className="link">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
