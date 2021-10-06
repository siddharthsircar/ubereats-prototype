import React, { Component } from "react";
import { Link } from "react-router-dom";
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  handleOpen = () => {
    this.setState({ isOpen: true });
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <nav className="ma3 mr4" style={{ background: "white" }}>
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
