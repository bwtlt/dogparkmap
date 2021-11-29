import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const Loading = function () {
  return (
    <Spinner animation="border" role="status" className="container">
      <span className="visually-hidden">Chargement...</span>
    </Spinner>
  );
};

export default Loading;
