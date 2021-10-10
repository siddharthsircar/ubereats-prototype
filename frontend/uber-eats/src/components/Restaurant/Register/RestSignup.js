import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { registerRest } from "../../../redux/actions/authAction";
import { formatPhoneNumber } from "../../../utils/utils";
import "./RestSignup.css";
import { states, cities, countries } from "../../../places";
class RestSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store_name: "",
      phone_number: "",
      timings: "",
      email: "",
      password: "",
      delivery_mode: "delivery",
      street_address: "",
      city: "",
      zip: "",
      state: "California",
      country: "United States",
      showError: false,
      signInError: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      authFlag: "false",
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const data = {
      store_name: this.state.store_name,
      phone_number: this.state.phone_number,
      timings: this.state.timings,
      email: this.state.email,
      password: this.state.password,
      delivery_mode: "delivery",
      street_address: this.state.street_address,
      city: this.state.city,
      zip: this.state.zip,
      state: this.state.state,
      country: this.state.country,
    };
    this.props.registerRest(data);
    setTimeout(() => {
      if (!this.props.authUser) {
        this.setState({ showError: true });
      } else {
        this.setState({
          showError: false,
        });
      }
    }, 2000);
  }

  inputChange = (e) => {
    let phone_number = "";
    const { name, value } = e.target;
    if (name === "phone_number") {
      phone_number = formatPhoneNumber(value);
      this.setState({ [name]: phone_number });
    } else {
      this.setState({ [name]: value, showError: false });
    }
  };

  render() {
    const {
      store_name,
      phone_number,
      timings,
      email,
      password,
      delivery_mode,
      street_address,
      city,
      zip,
      state,
      country,
    } = this.state;
    let signInError = null;
    if (this.props.authUser) {
      return <Redirect to="/restaurant/profile" />;
    } else if (!this.props.authUser && this.state.showError) {
      signInError = this.props.signInError;
    }
    let selectState = null;
    selectState = states.map((state) => {
      return (
        <option className="ttc" value={state}>
          {state}
        </option>
      );
    });
    let selectCity = null;
    selectCity = cities.map((city) => {
      return (
        <option className="ttc" value={city}>
          {city}
        </option>
      );
    });
    let selectCountry = null;
    selectCountry = countries.map((country) => {
      return (
        <option className="ttc" value={country}>
          {country}
        </option>
      );
    });
    return (
      <div>
        <main className="pa4 black-80 w-50 center main">
          <form className="measure center" onSubmit={this.handleSubmit}>
            <fieldset id="signin" className="ba b--transparent ph0 mh0">
              <legend className="f3 fw6 ph0 mh0 center">
                <img
                  src="https://img.icons8.com/external-inipagistudio-mixed-inipagistudio/30/000000/external-restaurant-hospitality-inipagistudio-mixed-inipagistudio.png"
                  alt="restaurant-icon"
                />{" "}
                Add Your Restaurant
              </legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="store_name">
                  Store Name
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent w-100"
                  type="text"
                  name="store_name"
                  id="store_name"
                  value={store_name}
                  onChange={this.inputChange}
                  autoFocus
                  required
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="phone_number">
                  Phone Number
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent w-100"
                  type="text"
                  // pattern="[0-9]"
                  placeholder="(212)477-1000"
                  name="phone_number"
                  id="phone_number"
                  value={phone_number}
                  onChange={this.inputChange}
                  required
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="phone_number">
                  Timings
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent w-100"
                  type="timings"
                  // pattern="[0-9]"
                  placeholder="7 a.m - 9 p.m"
                  name="timings"
                  id="timings"
                  value={timings}
                  onChange={this.inputChange}
                  required
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent w-100"
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={this.inputChange}
                  required
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f5" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent w-100"
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={this.inputChange}
                  required
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f5" htmlFor="delivery_mode">
                  Mode of Delivery
                </label>
                <select
                  className="b pa2 input-reset ba bg-transparent w-100"
                  name="delivery_mode"
                  id="delivery_mode"
                  value={this.state.delivery_mode}
                  onChange={this.inputChange}
                  required
                >
                  <option value="delivery">Delivery</option>
                  <option value="pickup">Pickup</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <legend className="f3 fw6 ph0 mh0">Address</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="street_address">
                  Street Address
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent w-100"
                  type="street_address"
                  name="street_address"
                  id="street_address"
                  value={street_address}
                  onChange={this.inputChange}
                  required
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="city">
                  City
                </label>
                <select
                  className="b pa2 input-reset ba bg-transparent w-100"
                  name="city"
                  id="city"
                  value={this.state.city}
                  onChange={this.inputChange}
                  required
                >
                  {selectCity}
                </select>
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="zip">
                  Zip Code
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent w-100"
                  type="zip"
                  name="zip"
                  id="zip"
                  value={zip}
                  onChange={this.inputChange}
                  required
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="state">
                  State
                </label>
                <select
                  className="b pa2 input-reset ba bg-transparent w-100"
                  name="state"
                  id="state"
                  value={this.state.state}
                  onChange={this.inputChange}
                  required
                >
                  {selectState}
                </select>
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="country">
                  Country
                </label>
                <select
                  className="b pa2 input-reset ba bg-transparent w-100"
                  name="country"
                  id="country"
                  value={this.state.country}
                  onChange={this.inputChange}
                  required
                >
                  {selectCountry}
                </select>
              </div>
              <div className="mv3 center b red">{signInError}</div>
            </fieldset>
            <div className="">
              <button
                className="b ph3 mt2 pv2 input-reset ba b--black bg-transparent grow pointer f5 dib"
                type="submit"
              >
                Signup
              </button>
            </div>
            <div className="lh-copy f4 mt3">
              Have an account?
              <Link
                to="/restaurant/login"
                className="b f4 link dim hover-black black db"
                style={{ "text-decoration": "none" }}
              >
                Sign In
              </Link>
            </div>
          </form>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  signInError: state.auth.error,
});

function mapDispatchToProps(dispatch) {
  return {
    registerRest: (payload) => dispatch(registerRest(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RestSignup);
