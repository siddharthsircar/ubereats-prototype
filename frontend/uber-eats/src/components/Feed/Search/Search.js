import React, { Component } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Link } from "react-router-dom";
import server from "../../../config";
import { connect } from "react-redux";
import axios from "axios";
import RestaurantCard from "../RestaurantCard/RestaurantCard";
import { Col, Row } from "react-bootstrap";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: "",
      showRestaurants: false,
      showFood: false,
      foodError: "",
      restError: "",
      food: "",
      q: this.props.location.state.searchQuery,
    };
  }

  componentDidMount = () => {
    axios
      .get(
        `${server}/restaurant/all?zip=${this.props.user.zip}&searchQuery=${this.state.q}`
      )
      .then((response) => {
        this.setState({
          restaurants: response.data.restaurants,
          showRestaurants: true,
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          this.setState({
            restError: "No items found matching your search query.",
          });
        } else {
          console.log(error.response.data);
        }
      });

    axios
      .get(`${server}/menu/items/all?searchQuery=${this.state.q}`)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            food: response.data.menu,
            showFood: true,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          this.setState({
            foodError: "No items found matching your search query.",
          });
        } else {
          console.log(error.response.data);
        }
      });
  };

  render() {
    let restaurantCards = null;
    let feed = null;
    if (this.state.showRestaurants && this.state.restaurants.length !== 0) {
      restaurantCards = this.state.restaurants.map((restaurant) => {
        return (
          <Col xs lg="2" className="ma2">
            <RestaurantCard restaurant={restaurant} />
          </Col>
        );
      });
      feed = (
        <Row>
          <Col>
            <Row>{restaurantCards}</Row>
          </Col>
        </Row>
      );
    } else {
      feed = (
        <div className="fl-jc-center">
          {this.state.restError
            ? this.state.restError
            : "No restaurants for your search."}
        </div>
      );
    }

    let foodCards = null;
    let foodResults = null;
    if (this.state.showFood) {
      foodCards = this.state.food.map((item) => {
        return (
          <Row xs className="ma2">
            <Link
              to={{
                pathname: "/restaurant",
                state: { restaurant: { rest_id: item.menu_id } },
              }}
            >
              <li className="flex items-center lh-copy pa3 ph0-l bb b--black-10">
                <img
                  src={item.item_image}
                  alt="item-img"
                  height="100px"
                  width="100px"
                />
                <div className="pl3 flex-auto">
                  <span className="f4 db black-70">{item.item_name}</span>
                  <span className="f6 db black-70">{item.item_price}</span>
                </div>
              </li>
            </Link>
          </Row>
        );
      });
      foodResults = (
        <Row>
          <Col>
            <Row>{foodCards}</Row>
          </Col>
        </Row>
      );
    } else {
      foodResults = (
        <div className="fl-jc-center">
          {this.state.foodError
            ? this.state.foodError
            : "No food items to be displayed"}
        </div>
      );
    }
    let defaultActiveKey = null;
    if (this.state.showRestaurants === true) {
      defaultActiveKey = "restaurant";
    } else defaultActiveKey = "food";
    return (
      <div style={{ position: "relative", top: "18vh" }}>
        <div className="center" style={{ width: "80%" }}>
          <div className="flex justify-between">
            <p className="i b">Showing results for {this.state.q}</p>
            <Link to="/user/feed">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
              </svg>
            </Link>
          </div>
          <Tabs
            defaultActiveKey={defaultActiveKey}
            id="uncontrolled-tab-example"
            className="mb-3 black"
          >
            <Tab eventKey="restaurant" title="Restaurant" className="pa2 black">
              <div>{feed}</div>
            </Tab>
            <Tab eventKey="food" title="Food" className="pa2 black">
              <div>{foodResults}</div>
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  user: state.auth.user,
});

export default connect(mapStateToProps)(Search);
