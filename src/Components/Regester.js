import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import registerBg from './Image/signinpage.png';

const Register = ({ onRegisterSuccess, onBackToHome }) => {
  const navigate = useNavigate();

  const validationSchema = yup.object({
    userName: yup.string().required('Mandatory field'),
    mailOrMobile: yup.string().required('Mandatory field'),
    password: yup.string().required('Mandatory field'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Mandatory field'),
    otp: yup
      .string()
      .length(4, 'Must be 4 characters')
      .required('Mandatory field'),
  });

  const formik = useFormik({
    initialValues: {
      userName: '',
      mailOrMobile: '',
      password: '',
      confirmPassword: '',
      otp: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      localStorage.setItem('loginForm', JSON.stringify(values));

      Swal.fire('Success!', 'Registered Successfully', 'success').then(() => {
        if (onRegisterSuccess) {
          const user = {
            name: values.userName,
            emailOrMobile: values.mailOrMobile,
          };
          onRegisterSuccess(user);
        }

        resetForm();
        navigate('/');
      });
    },
  });

  return (
    <div className="register-overlay" style={{
      backgroundImage: `url(${registerBg})`,
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
      <div className="register-content" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '40px', borderRadius: '10px' }}>
        <h2>Register</h2>
        <form className="form" onSubmit={formik.handleSubmit}>
          <div>
            <input
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

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="error">{formik.errors.confirmPassword}</div>
            )}
          </div>

          <div>
            <input
              name="otp"
              placeholder="OTP"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.otp}
            />
            {formik.touched.otp && formik.errors.otp && (
              <div className="error">{formik.errors.otp}</div>
            )}
          </div>

          <button type="submit">Register</button>

          <p>
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Login
            </Link>
          </p>

          {onBackToHome && (
            <p>
              <button type="button" onClick={onBackToHome}>
                Back to Home
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
