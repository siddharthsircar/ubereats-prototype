import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';

const Logo = () => {
    return (
        <div className='ma3'>
            <a href='/'>
                <Tilt className="Tilt" options={{ max: 65 }}>
                    <div className="Tilt-inner f2 pa3 logo-container">
                        <p className='pa0 ma0'>Uber</p>
                        <p className='pa0 ma0 b'>Eats</p>
                    </div>
                </Tilt>
            </a>

        </div>
    );
}

export default Logo;