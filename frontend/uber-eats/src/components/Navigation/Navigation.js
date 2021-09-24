import React, { Component } from "react";
import Logo from "./Logo/Logo";
import SigninButton from "./SigninButton/SigninButton";
import Burger from "./Menu/MenuIcon/Burgermenu";
import SearchBar from "./FeedNavBar/SearchBar/SearchBar";
import UserCity from "./FeedNavBar/UserCity/UserCity";
import UserProfile from "./FeedNavBar/UserProfile/UserProfile";
import { connect } from 'react-redux';

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: false
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
        if (this.props.authUser) {
            showSearch = <SearchBar />;
            showLocation = <UserCity />;
            showProfile = <UserProfile />
        }
        return (
            <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                <div className='ml4' style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                    {showMenu}
                    <Logo />
                </div>
                {showLocation}
                {showSearch}
                {showProfile}
                {showSignin}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.auth.authUser,
});

export default connect(mapStateToProps)(Navigation);

// export default Navigation;