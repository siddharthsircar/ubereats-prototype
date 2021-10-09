import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import "./Feed.css";
import axios from "axios";
import RestaurantCard from "./RestaurantCard/RestaurantCard";
import { Col, Row } from "react-bootstrap";
import server from "./../../config";

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      restaurants: null,
      showRestaurants: false,
    };
    if (this.props.location.state !== undefined) {
      let { city } = this.props.location.state;
      this.city = city;
    }
  }

  componentDidMount() {
    axios
      .get(`${server}/restaurant/all?zip=${this.props.user.zip}`)
      .then((response) => {
        this.setState({
          restaurants: response.data.restaurants,
          showRestaurants: true,
        });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          console.log(error.response.data);
        }
      });
  }

  render() {
    if (
      !this.props.authUser &&
      (this.city === undefined || this.city === null || !this.city)
    ) {
      return <Redirect to="/home" />;
    }
    let restaurantCards = null;
    let feed = null;
    if (this.state.showRestaurants) {
      restaurantCards = this.state.restaurants.map((restaurant) => {
        return (
          <Col className="ma2">
            <RestaurantCard restaurant={restaurant} />
          </Col>
        );
      });
      feed = (
        <Row>
          {/* <Col xs={2} className="shadow-2">
            <h3>Filters</h3>
          </Col> */}
          <Col>
            <Row>{restaurantCards}</Row>
          </Col>
        </Row>
      );
    } else
      feed = <div className="fl-jc-center">No Restaurants to be displayed</div>;
    return <div className="center pa3 page">{feed}</div>;
  }
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  user: state.auth.user,
});

export default connect(mapStateToProps)(Feed);
