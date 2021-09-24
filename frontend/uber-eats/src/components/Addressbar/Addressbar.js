import React from "react";

const Addressbar = () => {
    return (
        <div>
            <p className='f2 b' style={{ textAlign: 'center' }}>
                {'Want food? Get Food.'}
            </p>
            <div></div>
            <div className='fl-jc-center'>
                <div className='pa2 w-30 br3 shadow-5 fl-jc-spa' >
                    <input
                        type='text'
                        placeholder='Enter Address: Street Address, City'
                        className='f3 mh2 ma2 pa2 w-80 center'></input>
                    <button onClick={event => window.location.href = '/user/feed'} className='center w-30 ma2 grow f4 link ph2 pv2 dib white bg-black br3'>Find Food</button>
                </div>
            </div>
        </div>
    );
}

export default Addressbar;