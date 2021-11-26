import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

const Instructions = function () {
  return (
    <Accordion className="instructions container">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Instructions</Accordion.Header>
        <Accordion.Body>
          <ul>
            <li>
              Cliquez sur la carte pour ajouter un parc.
            </li>
            <li>
              Cliquez sur un point pour obtenir des informations.
            </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default Instructions;
