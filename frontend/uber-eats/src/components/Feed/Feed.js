import React, { Component } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: ''
        }
    }

    render() {
        let redirectVar = null;
        if (!localStorage.getItem('user')) {
            redirectVar = <Redirect to='/home' />
        }
        return (
            <div className='fl-jc-center page' >
                {redirectVar}
                No Restaurants to be displayed.
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.auth.authUser,
});

export default connect(mapStateToProps)(Feed);