import {
  React, useState, useEffect, useMemo,
} from 'react';
import * as Realm from 'realm-web';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MongoContext from './MongoContext';
import Map from './pages/Map';
import Authentication from './pages/Authentication';
import LogOut from './pages/Logout';
import Help from './pages/Help';
import Navigation from './components/Navigation';

const App = function () {
  const [client, setClient] = useState(null);
  const [user, setUser] = useState(null);
  const [app, setApp] = useState(new Realm.App({ id: 'application-0-kmwss' }));

  useEffect(() => {
    async function init() {
      if (!user) {
        setUser(
          app.currentUser
            ? app.currentUser
            : await app.logIn(Realm.Credentials.anonymous()),
        );
      }

      if (!client) {
        setClient(app.currentUser.mongoClient('mongodb-atlas'));
      }
    }

    init();
  }, [app, client, user]);

  function renderComponent(Component, additionalProps = {}) {
    return (
      <MongoContext.Consumer>
        {(mongoContext) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Component mongoContext={mongoContext} {...additionalProps} />
        )}
      </MongoContext.Consumer>
    );
  }

  const memoHook = useMemo(() => (
    {
      app, client, user, setClient, setUser, setApp,
    }
  ), [app, client, user]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dog Park Map</h1>
      </header>
      <BrowserRouter>
        <Navigation user={user} />
        <MongoContext.Provider
          value={memoHook}
        >
          <Routes>
            <Route path="/signup" element={renderComponent(Authentication, { type: 'create' })} />
            <Route path="/login" element={renderComponent(Authentication)} />
            <Route path="/logout" element={renderComponent(LogOut)} />
            <Route path="/help" element={renderComponent(Help)} />
            <Route path="/" element={renderComponent(Map)} />
          </Routes>
        </MongoContext.Provider>
      </BrowserRouter>
      <div className="footer fixed-bottom">
        Developpé par
        { ' ' }
        <a href="https://bwatelet.fr">bwatelet.fr</a>
      </div>
    </div>
  );
};

export default App;
