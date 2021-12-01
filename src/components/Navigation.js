import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { isAnon } from '../utils';

const Navigation = function ({ user }) {
  const loggedIn = !isAnon(user);
  return (
    <Navbar bg="light" expand="lg" className="container">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavLink to="/" className="nav-link">Carte</NavLink>
          {!loggedIn && <NavLink to="/signup" className="nav-link">Créer un compte</NavLink>}
          {!loggedIn && <NavLink to="/login" className="nav-link">Connexion</NavLink>}
          {loggedIn && <NavLink to="/logout" className="nav-link">Déconnexion</NavLink>}
          <NavLink to="/help" className="nav-link">Aide</NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

Navigation.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
};

Navigation.defaultProps = {
  user: null,
};

export default Navigation;
