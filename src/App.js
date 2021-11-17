import React from 'react';
import './App.css';
import Map from './components/Map';
import Instructions from './components/Instructions';

const App = function () {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Dog Park Map</h1>
        <p>Trouvez un endroit où vous promener avec votre chien</p>
      </header>
      <Instructions />
      <Map />
      <div>
        Developpé par
        { ' ' }
        <a href="https://bwatelet.fr">bwatelet.fr</a>
      </div>
    </div>
  );
};

export default App;
