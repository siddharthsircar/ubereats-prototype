import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { formatPhoneNumber } from "../../../../utils/utils";
import axios from "axios";
import server from "../../../../config";
import { updateDispatcher } from "../../../../redux/actions/authAction";
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store_image: [],
      store_name: this.props.restaurant.store_name,
      phone_number: this.props.restaurant.phone_number,
      timings: this.props.restaurant.timings,
      email: this.props.restaurant.email,
      street_address: this.props.restaurant.street_address,
      city: this.props.restaurant.city,
      zip: this.props.restaurant.zip,
      state: this.props.restaurant.state,
      country: this.props.restaurant.country,
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
    try {
      if (!this.state.store_image) {
        alert("Select a file first!");
      }
      const formData = new FormData();
      formData.append("file", this.state.store_image[0]);
      await axios
        .post(
          `${server}/restaurant/profile/uploadImage/${this.props.restaurant.rest_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          const data = {
            store_image: res.data.Location,
            store_name: this.state.store_name,
            phone_number: this.state.phone_number,
            timings: this.state.timings,
            email: this.state.email,
            street_address: this.state.street_address,
            city: this.state.city,
            zip: this.state.zip,
            state: this.state.state,
            country: this.state.country,
          };
          axios
            .put(
              `${server}/restaurant/profile/${this.props.restaurant.rest_id}`,
              data
            )
            .then((res) => {
              if (res.status === 200) {
                const restaurant = {
                  rest_id: this.props.restaurant.rest_id,
                  store_image: res.data.Location,
                  store_name: this.state.store_name,
                  phone_number: this.state.phone_number,
                  timings: this.state.timings,
                  email: this.state.email,
                  street_address: this.state.street_address,
                  city: this.state.city,
                  zip: this.state.zip,
                  state: this.state.state,
                  country: this.state.country,
                };
                this.props.updateDispatcher(restaurant);
                this.setState({ updated: true });
              }
            })
            .catch((err) => {
              console.log("Error while updating restaurant profile: ", err);
              alert("Unable to update profile");
            });
        });
    } catch (error) {
      console.log("Upload Image Error: ", error);
      const data = {
        store_name: this.state.store_name,
        phone_number: this.state.phone_number,
        timings: this.state.timings,
        email: this.state.email,
        street_address: this.state.street_address,
        city: this.state.city,
        zip: this.state.zip,
        state: this.state.state,
        country: this.state.country,
      };
      axios
        .put(
          `${server}/restaurant/profile/${this.props.restaurant.rest_id}`,
          data
        )
        .then((res) => {
          if (res.status === 200) {
            const restaurant = {
              rest_id: this.props.restaurant.rest_id,
              store_image: res.data.Location,
              store_name: this.state.store_name,
              phone_number: this.state.phone_number,
              timings: this.state.timings,
              email: this.state.email,
              street_address: this.state.street_address,
              city: this.state.city,
              zip: this.state.zip,
              state: this.state.state,
              country: this.state.country,
            };
            this.props.updateDispatcher(restaurant);
            this.setState({ updated: true });
          }
        })
        .catch((err) => {
          console.log("Error while updating restaurant profile: ", err);
          alert("Unable to update profile");
        });
    }
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
      store_name,
      phone_number,
      timings,
      email,
      street_address,
      city,
      zip,
      state,
      country,
    } = this.state;
    if (!this.props.authUser) {
      return <Redirect to="/home" />;
    }
    if (this.state.updated) {
      return <Redirect to="/restaurant/profile" />;
    }

    if (localStorage.getItem("userType") !== "restaurant") {
      return <Redirect to="/home" />;
    }
    return (
      <div>
        <main className="pa4 black-80 w-50 center main">
          <form className="measure center" onSubmit={this.handleSubmit}>
            <fieldset id="edit-profile" className="ba b--transparent ph0 mh0">
              <legend className="f3 fw6 ph0 mh0 center">
                Update Store Details
              </legend>
              <div className="mv3">
                <label className="db fw6 lh-copy f5" htmlFor="item_image">
                  Store Image
                </label>
                <input
                  className="input-reset bg-transparent  w-100"
                  type="file"
                  name="item_image"
                  id="item_image"
                  onChange={(event) =>
                    this.setState({ store_image: event.target.files })
                  }
                />
              </div>
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
                  disabled
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
            </fieldset>
            <div className="">
              <button
                className="b ph3 mt2 pv2 input-reset ba b--black bg-transparent grow pointer f5 dib"
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
  restaurant: state.auth.user,
});

function mapDispatchToProps(dispatch) {
  return {
    updateDispatcher: (payload) => dispatch(updateDispatcher(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
