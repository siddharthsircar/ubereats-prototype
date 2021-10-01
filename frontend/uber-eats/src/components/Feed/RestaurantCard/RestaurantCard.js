import React, { Component } from "react";
// import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
    Card, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle
} from 'reactstrap';

class RestaurantCard extends Component {
    render() {
        var resData = this.props.restaurant;
        let imageSrc = 'http://localhost:7000/public/restaurant_image.jpg';
        return (
            <Link to={{ pathname: '/restaurant', state: resData }} className="black hover-black" style={{ textDecoration: "none" }}>
                <Card className="shadow-3">
                    <CardBody>
                        <CardTitle tag="h5">{this.props.restaurant.store_name}</CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">{this.props.restaurant.city + ", " + this.props.restaurant.state}</CardSubtitle>
                    </CardBody>
                    {/* <img width="100%" src={imageSrc} alt="restaurant_image" /> */}
                    <CardBody>
                        <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                    </CardBody>
                </Card>
            </Link>
        );
    }
}

export default RestaurantCard;