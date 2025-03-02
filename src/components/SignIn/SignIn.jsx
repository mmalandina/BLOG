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
  const [signInUser] = useSignInUserMutation();
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
        if (error.data && error.data.errors) {
          const serverErrors = error.data.errors;
          for (const field in serverErrors) {
            setError(field, {
              type: 'server',
              message: serverErrors[field].join(', '),
            });
          }
        } else {
          alert('Sign in failed.');
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
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
        <button type="submit">Login</button>
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
