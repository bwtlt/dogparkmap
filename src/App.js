import {
  React, useState, useEffect, useMemo,
} from 'react';
import * as Realm from 'realm-web';
import Map from './components/Map';
import MongoContext from './MongoContext';
import Instructions from './components/Instructions';

const App = function () {
  const [client, setClient] = useState(null);
  const [user, setUser] = useState(null);
  const [app, setApp] = useState(new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID }));

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
      <MongoContext.Provider
        value={memoHook}
      >
        <Instructions />
        {renderComponent(Map)}
      </MongoContext.Provider>
      <div>
        Developpé par
        { ' ' }
        <a href="https://bwatelet.fr">bwatelet.fr</a>
      </div>
    </div>
  );
};

export default App;
