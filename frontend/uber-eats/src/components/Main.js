import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Home from './LandingPage/Home';
import Signin from './User/Signin/Signin';
import Register from './User/Register/Register';
import Feed from './Feed/Feed';
import NavBar from './Navigation/NavBar';
import RestSignin from './Restaurant/Signin/RestSignin';
import RestSignup from './Restaurant/Register/RestSignup';
import Profile from './User/Profile/Profile';
import RestaurantProfile from './Restaurant/Profile/RestaurantProfile';
class Main extends Component {
    render() {
        return (
            <div style={{ zIndex: '-1' }}>
                <Route path="/" component={NavBar} />
                <Route path="/home" component={Home} />
                <Route path="/user/login" component={Signin} />
                <Route path="/user/register" component={Register} />
                <Route path="/user/feed" component={Feed} />
                <Route path="/restaurant/login" component={RestSignin} />
                <Route path="/restaurant/register" component={RestSignup} />
                <Route path="/user/profile" component={Profile} />
                <Route path="/restaurant/profile" component={RestaurantProfile} />
            </div>
        );
    }
}

export default Main;