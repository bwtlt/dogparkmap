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
              <div className="text-page">
                <h1>{isLogIn(type) ? 'Connexion' : 'Créer un compte'}</h1>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Adresse e-mail</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Entrez une adresse e-mail valide"
                    name="email"
                    autoComplete="username"
                    value={values.email}
                    onChange={handleChange}
                    isValid={touched.email && !errors.email}
                  />
                  <Form.Text className="text-muted">
                    {isLogIn(type) ? '' : 'Nous ne partageons vos données avec personne.'}
                  </Form.Text>
                  <Form.Control.Feedback>{errors.email}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Mot de passe"
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
                    {isLogIn(type) ? 'Connexion' : 'Créer un compte'}
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
            Pas enregistré ?
            { ' ' }
            <a href="/signup">Créez un compte</a>
          </p>
        )}
        {!isLogIn(type)
        && (
          <p>
            Déjà enregistré ?
            { ' ' }
            <a href="/login">Connectez-vous</a>
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
