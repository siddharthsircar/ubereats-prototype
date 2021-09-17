import React, { Component } from "react";
import 'tachyons';
import Navigation from "./components/Navigation/Navigation";

class Home extends Component {
    render() {
        return (
            <div style={{ height: '100vh' }}>
                <Navigation />
            </div>
        )
    }
}

// Default when this file exports 1 thing.
export default Home;