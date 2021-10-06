import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./UserProfile.css";
class UserProfile extends Component {
  render() {
    return (
      <nav className="ma3">
        <Link to="/user/profile">
          <button
            id="login"
            className="border-0 pa2 b grow f4 black bg-white link pointer"
          >
            Profile
          </button>
        </Link>
      </nav>
    );
  }
}

export default UserProfile;
