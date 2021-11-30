import { React, useEffect } from 'react';
import * as Realm from 'realm-web';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Loading from '../components/Loading';
import { isAnon } from '../utils';

const LogOut = function ({ mongoContext: { app, setUser, setClient } }) {
  const navigate = useNavigate();

  useEffect(() => {
    async function logout() {
      await app.currentUser.logOut();
      // login anon user
      setUser(await app.logIn(Realm.Credentials.anonymous()));
      // set new client
      setClient(app.currentUser.mongoClient('mongodb-atlas'));
    }

    logout();

    if (isAnon()) {
      navigate('/', { replace: true });
    }
  }, [app, setClient, setUser]);

  return (
    <Loading />
  );
};

LogOut.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  mongoContext: PropTypes.object.isRequired,
};

export default LogOut;
