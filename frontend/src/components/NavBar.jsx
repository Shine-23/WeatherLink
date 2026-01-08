import { Link } from "react-router-dom";

const Navbar = ({ username, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3">
      <Link className="navbar-brand" to="/">
        WeatherLink
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-center">
          {!username ? (
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <span className="nav-link">
                  Hello, <strong>{username}</strong>
                </span>
              </li>

              <li className="nav-item">
                <button
                  className="btn btn-outline-light ms-2"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
