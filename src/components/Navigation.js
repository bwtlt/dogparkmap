import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isAnon } from '../utils';

const Navigation = function ({ user }) {
  const loggedIn = !isAnon(user);
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Dog Park Map</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link to="/" className="mx-2">Home</Link>
          {!loggedIn && <Link to="/signup" className="mx-2">Sign Up</Link>}
          {!loggedIn && <Link to="/signin" className="mx-2">Sign In</Link>}
          {loggedIn && <Link to="/logout" className="mx-2">Log out</Link>}
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
