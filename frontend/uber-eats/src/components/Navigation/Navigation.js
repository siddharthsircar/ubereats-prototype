import React from "react";
import Hamburger from "./Hamburger";
import Logo from "./Logo";
import Signin from "./Signin";

const Navigation = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Hamburger />
            <Logo />
            <Signin />
        </div>
    );
}

export default Navigation;