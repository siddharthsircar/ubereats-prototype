import React, { Component } from "react";
import Logo from "../Logo/Logo";
import SearchBar from "./SearchBar/SearchBar";
import UserCity from "./UserCity/UserCity";
import UserProfile from "./UserProfile/UserProfile";

class FeedNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: false
        }
    }
    render() {
        return (
            <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-evenly' }}>
                <div className='ml4' style={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-start' }}>
                    <Logo />
                </div>
                <div className='ml4' style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-evenly' }}>
                    <UserCity />
                    {/* Search Bar */}
                    <SearchBar />
                    <UserProfile />
                    {/* User Profile */}
                </div>

            </div>
        );
    }
}

export default FeedNav;