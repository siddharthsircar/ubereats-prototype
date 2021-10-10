import React from "react";
import { StyledMenu } from "./Menu.styled";
import { bool } from "prop-types";
import { Link } from "react-router-dom";
import "./Menu.css";

const Menu = ({ open, setOpen }) => {
  return (
    <StyledMenu open={open} className="border shadow-2">
      <Link to="/user/login">
        <button
          id="login"
          className="center pa2 pl4 pr4 b shadow-2 grow f4 white bg-black link pointer"
          onClick={() => setOpen(!open)}
        >
          Sign In
        </button>
      </Link>
      <br />
      <Link to="/restaurant/register">
        <div
          className="center"
          style={{ color: "black" }}
          onClick={() => setOpen(!open)}
        >
          Add Your Restaurant
        </div>
      </Link>
    </StyledMenu>
  );
};
Menu.propTypes = {
  open: bool.isRequired,
};

export default Menu;
