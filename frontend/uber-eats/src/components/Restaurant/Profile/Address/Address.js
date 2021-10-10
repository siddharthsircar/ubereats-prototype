import React, { Component } from "react";
import { connect } from "react-redux";
class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
    };
  }

  componentDidMount = () => {
    this.setState({
      user: this.props.user,
    });
  };

  render() {
    const { street_address, city, zip, state, country } = this.state.user;
    return (
      <div>
        <main className="pa4 black-80">
          <fieldset id="profile" className="ba b--transparent ph0 mh0">
            <legend className="f2 fw6 ph0 mh0">Store Address</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f4 b" htmlFor="street_address">
                Street
              </label>
              <label
                className="border db fw6 lh-copy f5"
                htmlFor="street_address"
              >
                {street_address}
              </label>
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f4 b" htmlFor="city">
                City
              </label>
              <label className="border db fw6 lh-copy f5" htmlFor="city">
                {city + ", " + zip}
              </label>
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f4 b" htmlFor="state">
                State
              </label>
              <label className="border db fw6 lh-copy f5" htmlFor="state">
                {state}
              </label>
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f4 b" htmlFor="country">
                Country
              </label>
              <label className="border db fw6 lh-copy f5" htmlFor="country">
                {country}
              </label>
            </div>
          </fieldset>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Address);
