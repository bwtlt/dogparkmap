import {
  React, useState, useEffect, useMemo,
} from 'react';
import * as Realm from 'realm-web';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Map from './components/Map';
import MongoContext from './MongoContext';
import Authentication from './components/Authentication';
import LogOut from './components/Logout';
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
        <p>Trouvez un endroit où vous promener avec votre chien</p>
      </header>
      <BrowserRouter>
        <Navigation user={user} />
        <MongoContext.Provider
          value={memoHook}
        >
          <Routes>
            <Route path="/signup" element={renderComponent(Authentication, { type: 'create' })} />
            <Route path="/signin" element={renderComponent(Authentication)} />
            <Route path="/logout" element={renderComponent(LogOut)} />
            <Route path="/" element={renderComponent(Map)} />
          </Routes>
        </MongoContext.Provider>
      </BrowserRouter>
      <div className="fixed-bottom">
        Developpé par
        { ' ' }
        <a href="https://bwatelet.fr">bwatelet.fr</a>
      </div>
    </div>
  );
};

export default App;
