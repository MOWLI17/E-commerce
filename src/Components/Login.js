import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import loginBg from './Image/loginpage.jpg';

const Login = ({ onBackToHome, onLoginSuccess }) => {
  const navigate = useNavigate();

  const validationSchema = yup.object({
    userName: yup.string().required('Required'),
    mailOrMobile: yup.string().required('Required'),
    password: yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      userName: '',
      mailOrMobile: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const storedUser = JSON.parse(localStorage.getItem('loginForm'));

      if (
        storedUser &&
        storedUser.userName === values.userName &&
        storedUser.mailOrMobile === values.mailOrMobile &&
        storedUser.password === values.password
      ) {
        // Trigger success callback
        if (onLoginSuccess) {
          onLoginSuccess({
            name: storedUser.userName,
            emailOrMobile: storedUser.mailOrMobile,
          });
        }

        Swal.fire({
          title: 'Success!',
          text: `Welcome back, ${storedUser.userName}!`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          resetForm();
          navigate('/');
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Invalid credentials. Please check your username, email/mobile, and password.',
          icon: 'error',
        });
      }
    },
  });

  return (
    <div className="loginpage" style={{
      backgroundImage: `url(${loginBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div className="login-page">
        <h2>Login</h2>
        <form className="form2" onSubmit={formik.handleSubmit}>
          <div>
            <input
              className="name"
              type="text"
              name="userName"
              placeholder="User Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.userName}
            />
            {formik.touched.userName && formik.errors.userName && (
              <div className="error">{formik.errors.userName}</div>
            )}
          </div>

          <div>
            <input
              className="mail"
              type="text"
              name="mailOrMobile"
              placeholder="Email or Mobile"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mailOrMobile}
            />
            {formik.touched.mailOrMobile && formik.errors.mailOrMobile && (
              <div className="error">{formik.errors.mailOrMobile}</div>
            )}
          </div>

          <div>
            <input
              className="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="error">{formik.errors.password}</div>
            )}
          </div>

          <button className="sign" type="submit">
            Login
          </button>
        </form>

        <p>
          Don't have an account?{' '}
          <Link to="/register" className="rhl">
            Register here
          </Link>
        </p>

        {onBackToHome ? (
          <p>
            <button type="button" onClick={onBackToHome} className="back-link">
              ← Back to Home
            </button>
          </p>
        ) : (
          <p>
            <Link to="/" className="back-link">
              ← Back to Home
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
