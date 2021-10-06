import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../../redux/actions/authAction";
import { formatPhoneNumber } from "../../../utils/utils";
import "./Register.css";
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      password: "",
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
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      phone_number: this.state.phone_number,
      email: this.state.email,
      password: this.state.password,
      street_address: this.state.street_address,
      city: this.state.city,
      zip: this.state.zip,
      state: this.state.state,
      country: this.state.country,
    };
    this.props.registerUser(data);
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
      first_name,
      last_name,
      phone_number,
      email,
      password,
      street_address,
      city,
      zip,
      state,
      country,
    } = this.state;

    // let signInError = null;
    if (this.props.authUser || localStorage.getItem("user")) {
      return <Redirect to="/user/feed" />;
    } else if (!this.props.authUser && this.state.showError) {
      console.log(this.props.signInError);
    }
    return (
      <div>
        <main className="pa4 black-80 w-50 center main">
          <form className="measure center" onSubmit={this.handleSubmit}>
            <fieldset id="signin" className="ba b--transparent ph0 mh0">
              <legend className="f3 fw6 ph0 mh0 center">
                <img
                  src="https://img.icons8.com/ios-glyphs/30/000000/gender-neutral-user.png"
                  alt="cutomer-icon"
                />{" "}
                Create new account
              </legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="first_name">
                  First Name
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent w-100"
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={first_name}
                  onChange={this.inputChange}
                  autoFocus
                  required
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="last_name">
                  Last Name
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent  w-100"
                  type="last_name"
                  name="last_name"
                  id="last_name"
                  value={last_name}
                  onChange={this.inputChange}
                  required
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="phone_number">
                  Phone Number
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent  w-100"
                  type="phone_number"
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
                <input
                  className="pa2 input-reset ba bg-transparent w-100"
                  type="city"
                  name="city"
                  id="city"
                  value={city}
                  onChange={this.inputChange}
                  required
                />
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
                <input
                  className="b pa2 input-reset ba bg-transparent w-100"
                  type="state"
                  name="state"
                  id="state"
                  value={state}
                  onChange={this.inputChange}
                  disabled
                  required
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="country">
                  Country
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent w-100"
                  type="country"
                  name="country"
                  id="country"
                  value={country}
                  onChange={this.inputChange}
                  disabled
                  required
                />
              </div>
              <div className="mv3 center b red">{/* {signInError} */}</div>
            </fieldset>
            <div className="">
              <button
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f5 dib"
                type="submit"
              >
                Sign Up
              </button>
            </div>
            <div className="lh-copy f4 mt3">
              Have an account?
              <Link
                to="/user/login"
                className="b f4 link dim hover-black black db"
                style={{ textDecoration: "none" }}
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
    registerUser: (payload) => dispatch(registerUser(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
