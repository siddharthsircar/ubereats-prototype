import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Home from './LandingPage/Home';
import Signin from './Signin/Signin';
import Register from './Register/Register';
import Feed from './Feed/Feed';
import RestSignin from './Restaurant/Signin/RestSignin';
import RestSignup from './Restaurant/Register/RestSignup';

class Main extends Component {
    render() {
        return (
            <div>
                <Route exact path="/" component={Home} />
                <Route exact path="/user/login" component={Signin} />
                <Route exact path="/user/register" component={Register} />
                <Route exact path="/user/feed" component={Feed} />
                <Route exact path="/restaurant/login" component={RestSignin} />
                <Route exact path="/restaurant/register" component={RestSignup} />
            </div>
        );
    }
}

export default Main;