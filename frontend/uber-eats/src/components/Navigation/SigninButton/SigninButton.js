import React from "react";

const SigninButton = () => {
    return (
        <nav className='ma3 mr4' style={{ background: 'white' }}>
            <a id='login' href='/user/login' className='br4 pa2 b shadow-2 grow f4 white bg-black link pa2 pointer'>Sign In</a>
        </nav>
    );
}

export default SigninButton;