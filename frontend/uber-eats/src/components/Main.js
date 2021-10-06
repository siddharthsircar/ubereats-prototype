import React, { Component } from "react";
import { Route } from "react-router-dom";
import Home from "./Home/Home";
import Signin from "./User/Signin/Signin";
import Register from "./User/Register/Register";
import Feed from "./Feed/Feed";
import RestSignin from "./Restaurant/Signin/RestSignin";
import RestSignup from "./Restaurant/Register/RestSignup";
import UserProfile from "./User/Profile/UserProfile";
import RestaurantProfile from "./Restaurant/Profile/RestaurantProfile";
import { Redirect } from "react-router";
class Main extends Component {
  render() {
    return (
      <div style={{ zIndex: "-1" }}>
        <Route exact path="/home" component={Home} />
        <Route
          exact
          path="/"
          render={() => {
            return <Redirect to="/home" />;
          }}
        />
        <Route exact path="/user/login" component={Signin} />
        <Route exact path="/user/register" component={Register} />
        <Route exact path="/user/feed" component={Feed} />
        <Route exact path="/restaurant/login" component={RestSignin} />
        <Route exact path="/restaurant/register" component={RestSignup} />
        <Route exact path="/user/profile" component={UserProfile} />
        <Route exact path="/restaurant/profile" component={RestaurantProfile} />
      </div>
    );
  }
}

export default Main;
