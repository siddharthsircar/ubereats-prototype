import React from "react";
import Logo from "./Logo/Logo";
import SigninButton from "./SigninButton/SigninButton";
import Burger from "./Menu/MenuIcon/Burgermenu";

const Navigation = (props) => {
    return (
        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
            <div className='ml4' style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                <Burger open={props.open} setOpen={props.setOpen} />
                <Logo />
            </div>
            <SigninButton />
        </div>
    );
}

export default Navigation;