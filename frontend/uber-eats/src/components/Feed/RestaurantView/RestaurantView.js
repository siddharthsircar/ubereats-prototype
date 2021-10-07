import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import {
  CardSubtitle,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import server from "../../../config";
import "./RestaurantView.css";
import Dropdown from "react-bootstrap/Dropdown";

class RestaurantView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantId: this.props.location.state.restaurant.rest_id,
      restaurant: "",
      menu: "",
      activeTab: "1",
      categories: "",
      types: "",
    };
  }

  componentDidMount = () => {
    if (localStorage.getItem("user")) {
      axios
        .get(`${server}/restaurant/profile/${this.state.restaurantId}`)
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              restaurant: res.data.user,
            });
            axios
              .get(`${server}/menu/items/${this.state.restaurantId}`)
              .then((res) => {
                if (res.status === 200) {
                  let item_categories = [];
                  let item_types = [];
                  for (var i = 0; i < res.data.menu.length; i++) {
                    if (!item_categories.includes(res.data.menu[i].category))
                      item_categories.push(res.data.menu[i].category);
                    if (!item_types.includes(res.data.menu[i].item_type))
                      item_types.push(res.data.menu[i].item_type);
                  }
                  this.setState({
                    menu: res.data.menu,
                    categories: item_categories,
                    types: item_types,
                  });
                } else console.log("Error while getting menu: ", res.data);
              })
              .catch((err) => {
                console.log("Error while getting restaurant menu: ", err);
                alert("Internal Server Error");
              });
          }
        })
        .catch((err) => {
          if (err.status === 404) {
            console.log("Restaurant you are trying to view does not exist.");
          } else {
            console.log("Error while getting restaurant profile: ", err);
            alert("Unable to get restaurant profile");
          }
        });
    } else alert("Unable to get data from server");
  };

  render() {
    if (
      !this.props.authUser ||
      localStorage.getItem("userType") !== "customer"
    ) {
      return <Redirect to="/home" />;
    }
    let image_url = "";
    if (this.state.restaurant.store_image) {
      image_url = this.state.restaurant.store_image;
    }
    let items = null;
    if (this.state.menu.length !== 0) {
      let menuCards = this.state.menu.map((item) => {
        return (
          <Col>
            <Card className="shadow-3 ma1">
              <div>
                <div className="fl w-80 pa2">
                  <CardTitle tag="h5">{item.item_name}</CardTitle>
                  <div className="desc" style={{ height: "48px" }}>
                    {item.item_desc}
                  </div>
                  <CardSubtitle tag="h6" className="mb-2 pt2 text-muted">
                    {item.item_price}
                  </CardSubtitle>
                </div>
                <div className="fl w-20">
                  <img
                    width="150px"
                    height="127px"
                    src={item.item_image}
                    alt="item-img"
                  />
                </div>
              </div>
            </Card>
          </Col>
        );
      });
      items = (
        <Row xs="3" className="pa3">
          {menuCards}
        </Row>
      );
    } else
      items = <div className="h2 b flex justify-center">No Items in menu.</div>;
    return (
      <div className="profile-parent">
        <div className="center">
          <div
            className="flex justify-between items-end rest-details pb3 pt3 pl4 br2"
            style={{
              backgroundImage: `url(${image_url})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              height: "30vh",
            }}
          >
            <div>
              <div className="store-name b f3 white">
                {`${this.state.restaurant.store_name} (${this.state.restaurant.street_address})`}
              </div>
              <div className="contact-details white em">
                <span className="ma2">{`+1 ${this.state.restaurant.phone_number} • ${this.state.restaurant.email}`}</span>
                <br />
                <span className="ma2">{`${this.state.restaurant.city}, ${this.state.restaurant.state}`}</span>
                <br />
                <span className="ma2">{`Timings: ${this.state.restaurant.timings}`}</span>
              </div>
            </div>
            <br />
            <div className="pr4">
              <img
                className="bg-white"
                src="https://img.icons8.com/ios-glyphs/30/000000/like--v2.png"
                alt="fav-icon"
              />
            </div>
          </div>
          <div className="flex justify-start items-center pt2 pl3">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Filter
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>Action</Dropdown.Item>
                <Dropdown.Item>Another action</Dropdown.Item>
                <Dropdown.Item>Something else</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="bg-white" width="100%">
            {items}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  userId: state.auth.userId,
});

export default connect(mapStateToProps)(RestaurantView);
