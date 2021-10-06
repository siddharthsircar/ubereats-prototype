import React, { Component } from "react";
// import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
    Card, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle
} from 'reactstrap';
import logo from '../../../assets/images/restaurant_image.jpg';
class RestaurantCard extends Component {
    render() {
        var resData = this.props.restaurant;
        return (
            <Link to={{ pathname: '/restaurant', state: resData }} className="black hover-black" style={{ textDecoration: "none" }}>
                <Card className="shadow-3">
                    <img width="100%" src={logo} alt="restaurant_image" />
                    <CardBody>
                        <CardTitle tag="h5">{this.props.restaurant.store_name + ` (${this.props.restaurant.street_address})`}</CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">{this.props.restaurant.city + ", " + this.props.restaurant.state}</CardSubtitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">{`Open ${this.props.restaurant.timings}`}</CardSubtitle>
                    </CardBody>
                </Card>
            </Link>
        );
    }
}

export default RestaurantCard;