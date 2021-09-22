import React from "react";
import Logo from "./Logo/Logo";
import Signin from "./Signin/Signin";
import Burger from "./Menu/MenuIcon/Burgermenu";

const Navigation = (props) => {
    return (
        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
            <div className='ml4' style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                <Burger open={props.open} setOpen={props.setOpen} />
                <Logo />
            </div>
            <Signin />
        </div>
    );
}

export default Navigation;