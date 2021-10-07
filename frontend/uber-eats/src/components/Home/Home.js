import React, { Component } from "react";
import "tachyons";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
    };
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput = (e) => {
    this.setState({ city: e.target.value });
  };

  render() {
    if (this.props.authUser) {
      if (localStorage.getItem("userType") === "customer") {
        return <Redirect to="/user/feed" />;
      } else if (localStorage.getItem("userType") === "restaurant") {
        return <Redirect to="/restaurant/profile" />;
      }
    }
    return (
      <div className="home-container">
        <div className="address-container">
          <p className="f2 b w-50 center" style={{ textAlign: "center" }}>
            {"Want food? Get Food."}
          </p>
          <div></div>
          <div className="fl-jc-center">
            <div className="pa2 w-30 br3 shadow-5 fl-jc-spa">
              <input
                type="text"
                placeholder="Street Address, City, Zip"
                className="f3 br3 mh2 ma2 pa2 w-80 center"
                value={this.state.city}
                onChange={this.handleInput}
              />
              <div style={{ width: "10px" }}></div>
              <button className="center w-30 ma2 grow f4 link ph2 pv2 dib bg-black br3">
                <Link
                  to={{
                    pathname: "/user/feed",
                    state: {
                      city: this.state.city,
                    },
                  }}
                  className="find-food"
                >
                  Find Food
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
});

export default connect(mapStateToProps)(Home);
