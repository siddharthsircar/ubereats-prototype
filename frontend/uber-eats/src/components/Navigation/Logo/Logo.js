import React from 'react';
import Tilt from 'react-tilt';

const Logo = () => {
    return (
        <div className='ma3'>
            <a href='/' style={{ textDecoration: 'none', color: 'black' }}>
                <Tilt className="Tilt" options={{ max: 65 }} /*style={{ height: 50, width: 250 }}*/ >
                    <div className="Tilt-inner f2 pa3" style={{ display: 'flex' }}>
                        <p className='pa0 ma0'>Uber</p>
                        <p className='pa0 ma0' style={{ fontWeight: 'bold' }}>Eats</p>
                    </div>
                </Tilt></a>

        </div>
    );
}

export default Logo;