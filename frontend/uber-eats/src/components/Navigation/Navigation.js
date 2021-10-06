import React, { Component } from "react";
import Logo from "./Logo/Logo";
import SigninButton from "./SigninButton/SigninButton";
import Burger from "./Menu/MenuIcon/Burgermenu";
import SearchBar from "./FeedNavBar/SearchBar/SearchBar";
import UserCity from "./FeedNavBar/UserCity/UserCity";
import UserProfile from "./FeedNavBar/UserProfile/UserProfile";
import { connect } from 'react-redux';
import './Navigation.css';

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
        if (!this.props.authUser) {
            showMenu = <Burger open={this.props.open} setOpen={this.props.setOpen} />;
            showSignin = <SigninButton />;
        }
        else {
            if (localStorage.getItem('userType') === 'customer') {
                showSearch = <SearchBar />;
                showLocation = <UserCity />;
                showProfile = <UserProfile />
            }
        }
        return (
            <div>
                <div className="shadow-3 nav-container">
                    <div className='ml4 logo'>
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