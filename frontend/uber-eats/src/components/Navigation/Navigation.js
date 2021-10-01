import React, { Component } from "react";
import Logo from "./Logo/Logo";
import SigninButton from "./SigninButton/SigninButton";
import Burger from "./Menu/MenuIcon/Burgermenu";
import SearchBar from "./FeedNavBar/SearchBar/SearchBar";
import UserCity from "./FeedNavBar/UserCity/UserCity";
import UserProfile from "./FeedNavBar/UserProfile/UserProfile";
import { connect } from 'react-redux';
import { Redirect } from "react-router";

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: false,
        }
    }

    render() {
        let showMenu = null;
        let showSignin = null
        let showSearch = null;
        let showLocation = null;
        let showProfile = null;
        let redirectVar = null;
        if (!localStorage.getItem('user')) {
            showMenu = <Burger open={this.props.open} setOpen={this.props.setOpen} />;
            showSignin = <SigninButton />;
            redirectVar = <Redirect to="/home" />;
        }
        else if (localStorage.getItem('userType') === 'customer') {
            showSearch = <SearchBar />;
            showLocation = <UserCity />;
            showProfile = <UserProfile />
            redirectVar = <Redirect to="/user/feed" />;
        }
        else if (localStorage.getItem('userType') === 'restaurant') {
            redirectVar = <Redirect to="/restaurant/profile" />;
        }
        return (
            <div>
                {redirectVar}
                <div className="shadow-3" style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', overflow: 'hidden', position: 'fixed', width: '100vw', top: '0', background: 'white', height: '80px', zIndex: '1000' }}>
                    <div className='ml4' style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                        {showMenu}
                        <Logo />
                    </div>
                    {showLocation}
                    {showSearch}
                    {showProfile}
                    {showSignin}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.auth.authUser,
});

export default connect(mapStateToProps)(Navigation);