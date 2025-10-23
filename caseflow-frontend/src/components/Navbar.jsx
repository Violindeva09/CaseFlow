import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-title">🌐 CaseFlow</div>
      <div className="navbar-links">
        <Link to="/">Sign In</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/agent">Agent</Link>
        <Link to="/citizen">Citizen</Link>
      </div>
    </nav>
  );
}

export default Navbar;
