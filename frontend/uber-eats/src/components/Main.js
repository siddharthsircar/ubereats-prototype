import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Home from './LandingPage/Home';
import Signin from './Signin/Signin';
import { RegisterUser } from './Register/Register';

class Main extends Component {
    render() {
        return (
            <div>
                <Route exact path="/" component={Home} />
                <Route exact path="/user/login" component={Signin} />
                <Route exact path="/user/register" component={RegisterUser} />
            </div>
        );
    }
}

export default Main;