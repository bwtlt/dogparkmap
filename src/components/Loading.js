import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const Loading = function () {
  return (
    <div className="container spinner">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Chargement...</span>
      </Spinner>
    </div>
  );
};

export default Loading;
