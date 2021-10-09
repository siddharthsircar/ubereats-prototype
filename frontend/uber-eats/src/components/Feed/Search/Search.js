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
      result: "",
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
        if (error.response && error.response.data) {
          console.log(error.response.data);
        }
      });
  };

  // componentDidUpdate = () => {
  //   axios
  //     .get(
  //       `${server}/restaurant/all?zip=${this.props.user.zip}&searchQuery=${this.props.location.state.searchQuery}`
  //     )
  //     .then((response) => {
  //       this.setState({
  //         restaurants: response.data.restaurants,
  //         showRestaurants: true,
  //       });
  //     })
  //     .catch((error) => {
  //       if (error.response && error.response.data) {
  //         console.log(error.response.data);
  //       }
  //     });
  // };

  render() {
    let restaurantCards = null;
    let feed = null;
    if (this.state.showRestaurants) {
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
    } else
      feed = <div className="fl-jc-center">No Restaurants to be displayed</div>;

    return (
      <div style={{ position: "relative", top: "18vh" }}>
        <div className="center" style={{ width: "80%" }}>
          <div className="flex justify-end">
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
            defaultActiveKey="restaurant"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="restaurant" title="Restaurant" className="pa2">
              <div>
                <p className="i b">Showing results for {this.state.q}</p>
                {feed}
              </div>
            </Tab>
            <Tab eventKey="food" title="Food">
              <div>Hello There</div>
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
