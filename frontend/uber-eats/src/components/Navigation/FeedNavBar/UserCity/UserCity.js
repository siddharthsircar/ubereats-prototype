import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { connect } from "react-redux";

class UserCity extends Component {
  onClick = () => {
    alert("Hello");
  };
  render() {
    let { street_address, city } = this.props.user;
    return (
      <div>
        <Form className="d-flex">
          <img
            src="https://img.icons8.com/small/32/000000/marker.png"
            alt="location-icon"
          />
          <FormControl
            type="label"
            placeholder="City"
            className="mr-2"
            value={street_address + ", " + city}
            disabled
            onClick={this.onClick}
            aria-label="Search"
          />
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  user: state.auth.user,
});

export default connect(mapStateToProps)(UserCity);
