import { React, useState, useEffect } from 'react';
import { Formik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import * as Realm from 'realm-web';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { isAnon } from '../utils';

const userSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(8),
});

function isLogIn(type) {
  return type === 'login';
}

const Authentication = function ({ mongoContext: { app, user, setUser }, type }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (values) => {
    setLoading(true);
    if (type === 'create') {
      // create
      await app.emailPasswordAuth.registerUser(values.email, values.password);
    }

    // login user and redirect to home
    const credentials = Realm.Credentials.emailPassword(
      values.email,
      values.password,
    );
    setUser(await app.logIn(credentials));
    setLoading(false);
  };

  useEffect(() => {
    if (!isAnon(user)) {
      navigate('/', { replace: true });
    }
  }, [navigate, user]);

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={userSchema}
        onSubmit={submitHandler}
      >
        {({
          errors, touched, handleSubmit, values, handleChange,
        }) => (
          <Form noValidate onSubmit={handleSubmit} className="container">
            {loading && <Loading />}
            {!loading && (
              <div className="auth-form">
                <h1>{isLogIn(type) ? 'Log In' : 'Sign Up'}</h1>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    autoComplete="username"
                    value={values.email}
                    onChange={handleChange}
                    isValid={touched.email && !errors.email}
                  />
                  <Form.Text className="text-muted">
                    We&apos;ll never share your email with anyone else.
                  </Form.Text>
                  <Form.Control.Feedback>{errors.email}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={handleChange}
                    isValid={touched.password && !errors.password}
                  />
                  <Form.Control.Feedback>
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="text-center mt-2 mb-2">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
      <div>
        {isLogIn(type)
        && (
          <p>
            Not registered?
            { ' ' }
            <a href="/signup">Create an account.</a>
          </p>
        )}
        {!isLogIn(type)
        && (
          <p>
            Already registered?
            { ' ' }
            <a href="/login">Log in.</a>
          </p>
        )}
      </div>
    </>
  );
};

Authentication.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  mongoContext: PropTypes.object.isRequired,
  type: PropTypes.string,
};

Authentication.defaultProps = {
  type: 'login',
};

export default Authentication;
