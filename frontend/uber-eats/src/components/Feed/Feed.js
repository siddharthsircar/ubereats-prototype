import React, { Component } from "react";
import { connect } from 'react-redux';
import FeedNav from "../Navigation/FeedNavBar/FeedNav";
import './Feed.style.css';
import Navigation from "../Navigation/Navigation";

class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: ''
        }
    }

    render() {
        return (
            <Navigation />
            // Restaurant List cards
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.auth.authUser,
});

export default connect(mapStateToProps)(Feed);