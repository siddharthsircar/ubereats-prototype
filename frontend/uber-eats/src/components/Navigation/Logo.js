import React from 'react';
import Tilt from 'react-tilt';

const Logo = () => {
    return (
        <div className='ma3'>
            <Tilt className="Tilt br2 shadow-2 pa3" options={{ max: 25 }} style={{ height: 50, width: 250 }} >
                <div className="Tilt-inner f3"> uberEATS </div>
            </Tilt>
        </div>
    );
}

export default Logo;