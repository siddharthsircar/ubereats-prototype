import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { formatPhoneNumber } from "../../../../utils/utils";
import axios from "axios";
import server from "../../../../config";
import { updateDispatcher } from "../../../../redux/actions/authAction";

class EditUserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: this.props.user.first_name,
      last_name: this.props.user.last_name,
      phone_number: this.props.user.phone_number,
      email: this.props.user.email,
      street_address: this.props.user.street_address,
      city: this.props.user.city,
      zip: this.props.user.zip,
      state: this.props.user.state,
      country: this.props.user.country,
      updated: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      authFlag: "false",
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      phone_number: this.state.phone_number,
      email: this.state.email,
      street_address: this.state.street_address,
      city: this.state.city,
      zip: this.state.zip,
      state: this.state.state,
      country: this.state.country,
    };
    axios
      .put(`${server}/user/profile/${this.props.user.user_id}`, data)
      .then((res) => {
        if (res.status === 200) {
          // let user = {
          //   user_id: this.props.user.user_id,
          //   first_name: this.state.first_name,
          //   last_name: this.state.last_name,
          //   phone_number: this.state.phone_number,
          //   email: this.state.email,
          //   street_address: this.state.street_address,
          //   city: this.state.city,
          //   zip: this.state.zip,
          //   state: this.state.state,
          //   country: this.state.country,
          // };
          //this.props.updateDispatcher(user);
          this.setState({ updated: true });
        }
      })
      .catch((err) => {
        console.log("Error while updating restaurant profile: ", err);
        alert("Unable to update profile");
      });
  };

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
      street_address,
      city,
      zip,
      state,
      country,
    } = this.state;

    // let signInError = null;
    if (!this.props.authUser) {
      return <Redirect to="/home" />;
    }
    if (localStorage.getItem("userType") !== "customer") {
      return <Redirect to="/home" />;
    }
    if (this.state.updated) {
      return <Redirect to="/user/profile" />;
    }
    return (
      <div>
        <main className="pa4 black-80 w-50 center main">
          <form className="measure center" onSubmit={this.handleSubmit}>
            <fieldset
              id="edit-user-profile"
              className="ba b--transparent ph0 mh0"
            >
              <legend className="f3 fw6 ph0 mh0 center">Update Details</legend>
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
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={last_name}
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
                  disabled
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="phone_number">
                  Phone Number
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent  w-100"
                  type="text"
                  placeholder="(212)477-1000"
                  name="phone_number"
                  id="phone_number"
                  value={phone_number}
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
                  type="text"
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
                  type="text"
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
                  type="text"
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
                  type="text"
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
                  type="text"
                  name="country"
                  id="country"
                  value={country}
                  onChange={this.inputChange}
                  disabled
                  required
                />
              </div>
            </fieldset>
            <div className="">
              <button
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f5 dib"
                type="submit"
              >
                Update
              </button>
            </div>
          </form>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  user: state.auth.user,
});

function mapDispatchToProps(dispatch) {
  return {
    updateDispatcher: (payload) => dispatch(updateDispatcher(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUserProfile);
