import React, { Component } from "react";
import 'tachyons';
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import { connect } from 'react-redux';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: ''
        }
    }
    render() {
        let redirectVar = null;
        if (this.props.authUser) {
            if (localStorage.getItem('userType') === 'customer') {
                redirectVar = <Redirect to="/user/feed" />;
            }
            else if (localStorage.getItem('userType') === 'restaurant') {
                redirectVar = <Redirect to="/restaurant/profile" />;
            }
        }
        return (
            <div style={{ height: '100vh', background: 'linear-gradient(89deg, #ff5edf 0%, #04c8de 100%)', zIndex: '-1000', }}>
                {redirectVar}
                <div style={{ top: '25vh', position: 'relative' }}>
                    <p className='f2 b' style={{ textAlign: 'center' }}>
                        {'Want food? Get Food.'}
                    </p>
                    <div></div>
                    <div className='fl-jc-center'>
                        <div className='pa2 w-30 br3 shadow-5 fl-jc-spa' >
                            <input
                                type='text'
                                placeholder='Enter Address: Street Address, City'
                                className='f3 br3 mh2 ma2 pa2 w-80 center'></input>
                            <button
                                className='center w-30 ma2 grow f4 link ph2 pv2 dib white bg-black br3'>
                                <Link
                                    to="/user/feed" className='white'
                                    style={{ 'text-decoration': 'none' }}
                                >
                                    Find Food
                                </Link>
                            </button>
                        </div>
                    </div>
                </div >
            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.auth.authUser,
});

export default connect(mapStateToProps)(Home);