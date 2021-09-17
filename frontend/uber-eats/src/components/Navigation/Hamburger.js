import React from 'react';
import Tilt from 'react-tilt';

const Hamburger = () => {
    return (
        <div className='ma3'>
            <Tilt className="Tilt" options={{ max: 25 }} style={{ height: 50, width: 50 }} >
                <div className="Tilt-inner"> M </div>
            </Tilt>
        </div>
    );
}

export default Hamburger;