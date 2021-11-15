import React, { Component } from "react";
// import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import "./RestaurantCard.css";
class RestaurantCard extends Component {
  render() {
    let resData = this.props.restaurant;
    return (
      <Link
        to={{ pathname: "/restaurant", state: { restaurant: resData } }}
        className="black hover-black"
        style={{ textDecoration: "none" }}
      >
        <Card className="shadow-3">
          <img
            width="500"
            height="300"
            src={this.props.restaurant.store_image}
            alt="store-img"
          />
          <CardBody>
            <CardTitle className="title" tag="h5" style={{ height: "48px" }}>
              {this.props.restaurant.store_name +
                ` (${this.props.restaurant.address.street_address})`}
            </CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">
              {this.props.restaurant.address.city +
                ", " +
                this.props.restaurant.address.state}
            </CardSubtitle>
            <CardSubtitle
              tag="h6"
              className="mb-2 text-muted"
            >{`Open ${this.props.restaurant.timings}`}</CardSubtitle>
          </CardBody>
        </Card>
      </Link>
    );
  }
}

export default RestaurantCard;
