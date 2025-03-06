import React from 'react';
import { useForm } from 'react-hook-form';
import { useSignInUserMutation } from '../../store/apiSlice';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const [signInUser, { isLoading }] = useSignInUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const { email, password } = data;
    signInUser({ email, password })
      .unwrap()
      .then((response) => {
        dispatch(setToken(response.user.token));
        dispatch(setUser(response.user));
        navigate('/articles');
      })
      .catch((error) => {
        if (error.status === 422 || error.data?.error === 'Unauthorized') {
          setError('email', {
            type: 'server',
            message: 'Неверный email или пароль.',
          });
          setError('password', {
            type: 'server',
            message: 'Неверный email или пароль.',
          });
        } else if (error.data?.errors) {
          Object.entries(error.data.errors).forEach(([field, messages]) => {
            setError(field, { type: 'server', message: messages.join(', ') });
          });
        } else {
          setError('root', {
            type: 'server',
            message: 'Произошла ошибка. Попробуйте снова.',
          });
        }
      });
  };

  return (
    <div className="signin">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="signin__form">
        <label className="signin__form_item">
          Email address
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
        <label className="signin__form_item">
          Password
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </label>
        {errors.root && <p className="error">{errors.root.message}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Login'}
        </button>
        <p className="link__description">
          Don’t have an account?{' '}
          <Link to="/sign-up" className="link">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
