import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import "./Feed.css";
import axios from "axios";
import RestaurantCard from "./RestaurantCard/RestaurantCard";
import { Col, Row } from "react-bootstrap";
import server from "./../../config";
import { setDeliveryModeDispachter } from "../../redux/actions/orderActions";
class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      restaurants: null,
      filteredRestaurants: null,
      showRestaurants: false,
    };
    if (this.props.location.state !== undefined) {
      let { city } = this.props.location.state;
      this.city = city;
    }
  }

  componentDidMount() {
    if (
      this.props.authUser &&
      (this.city === undefined || this.city === null || !this.city)
    ) {
      axios
        .get(`${server}/restaurant/all?zip=${this.props.user.zip}`)
        .then((response) => {
          if (response.status === 200) {
            this.setState({
              filteredRestaurants: response.data.restaurants,
              restaurants: response.data.restaurants,
              showRestaurants: true,
            });
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            console.log(error.response.data);
          }
        });
    } else {
      axios
        .get(`${server}/restaurant/all`)
        .then((response) => {
          this.setState({
            filteredRestaurants: response.data.restaurants,
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
    let filteredRestaurants = this.state.restaurants;
    if (this.state.showRestaurants) {
      if (this.props.delivery_mode === "pickup") {
        var filteredList = this.state.restaurants.filter(
          (restaurant) =>
            restaurant.delivery_mode.toLowerCase() ===
              this.props.delivery_mode ||
            restaurant.delivery_mode.toLowerCase() === "both"
        );
        filteredRestaurants = filteredList;
      }
      restaurantCards = filteredRestaurants.map((restaurant) => {
        return (
          <Col className="ma2">
            <RestaurantCard guest={"true"} restaurant={restaurant} />
          </Col>
        );
      });
      feed = (
        <Row>
          {/* <Col lg="1" className="mb4 b">
            <Card>
              Filters:
              <input type="checkbox" value="Vegan" />
            </Card>
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
  delivery_mode: state.delivery.delivery_mode,
});

const mapDispatchToProps = (dispatch) => ({
  setDeliveryMode: (payload) => dispatch(setDeliveryModeDispachter(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
