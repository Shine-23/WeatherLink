import React from "react";

const Navbar = ({ username, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3">
      <a className="navbar-brand" href="/">WeatherLink</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {!username && (
            <li className="nav-item">
              <a className="nav-link" href="/login">Login</a>
            </li>
          )}
          {username && (
            <>
              <li className="nav-item">
                <span className="nav-link">Hello, {username}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light ms-2" onClick={onLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
