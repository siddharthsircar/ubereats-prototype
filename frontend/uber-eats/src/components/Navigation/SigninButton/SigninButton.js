import React from "react";
import { Link } from 'react-router-dom';

const SigninButton = (props) => {
    return (
        <nav className='ma3 mr4'>
            <Link to="/user/login"><button id='login' className='br4 pa2 b shadow-2 grow f4 white bg-black link pointer'>Sign In</button></Link>
        </nav>
    );
}

export default SigninButton;