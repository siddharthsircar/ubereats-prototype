import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
} from "reactstrap";
import classnames from "classnames";
import "bootstrap/dist/css/bootstrap.min.css";

import Address from "./Address/Address";
import { logoutDispatcher } from "../../../redux/actions/authAction";
import server from "../../../config";
import Menu from "./StoreMenu/StoreMenu";
import "./RestaurantProfile.css";
import Orders from "./Orders/Orders";

class RestaurantProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantId: "",
      restaurant: "",
      menu: "",
      activeTab: "1",
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount = () => {
    if (localStorage.getItem("user")) {
      let rest_id = JSON.parse(localStorage.getItem("user")).rest_id;
      axios
        .get(`${server}/restaurant/profile/${rest_id}`)
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              restaurant: res.data.user,
              restaurantId: rest_id,
            });
          }
        })
        .catch((err) => {
          console.log("Error while getting restaurant profile: ", err);
          alert("Unable to get restaurant profile");
        });
    } else alert("Unable to get data from server");
  };

  handleLogout = () => {
    this.props.logoutDispatcher();
  };

  render() {
    const toggle = (tab) => {
      if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
    };
    if (!this.props.authUser) {
      return <Redirect to="/home" />;
    }
    if (localStorage.getItem("userType") !== "restaurant") {
      return <Redirect to="/home" />;
    }
    let address = null;
    if (this.state.restaurant) {
      address = <Address userDets={this.state.restaurant} />;
    }
    let menu = null;
    if (this.state.restaurantId) {
      menu = <Menu />;
    }
    let image_url = "";
    if (this.state.restaurant.store_image) {
      image_url = this.state.restaurant.store_image;
    }
    let orders = null;
    if (this.state.restaurant) {
      orders = <Orders />;
    } else orders = <div>You have no past orders</div>;
    return (
      <div
        className="profile-parent"
        style={{ backgroundImage: `url(${image_url})` }}
      >
        <div className="center rest-profile">
          <br />
          <div className="flex justify-between items-center rest-info pb3 pt3 br2">
            <div>
              <div className="store-name b f3 white">
                {this.state.restaurant.store_name}
              </div>
              <div className="contact-details white em">
                <span className="ma2">{`+1 ${this.state.restaurant.phone_number} • ${this.state.restaurant.email}`}</span>
                <br />
                <span className="ma2">{`Timings: ${this.state.restaurant.timings}`}</span>
              </div>
            </div>
            <br />
            <div>
              <Link to="/restaurant/edit">
                <Button color="dark">Edit Profile</Button>
              </Link>
            </div>
          </div>
          <div className="br3 shadow-5 bg-white">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames(
                    { active: this.state.activeTab === "1" },
                    "b black pointer"
                  )}
                  onClick={() => {
                    toggle("1");
                  }}
                >
                  <p className="black b">Address</p>
                </NavLink>
              </NavItem>
              <NavItem className="black">
                <NavLink
                  className={classnames(
                    { active: this.state.activeTab === "2" },
                    "b black pointer"
                  )}
                  onClick={() => {
                    toggle("2");
                  }}
                >
                  <p className="black b">Menu</p>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames(
                    { active: this.state.activeTab === "3" },
                    "b black pointer"
                  )}
                  onClick={() => {
                    toggle("3");
                  }}
                >
                  <p className="black b">Orders</p>
                </NavLink>
              </NavItem>
              <NavItem className="right">
                <NavLink
                  className={classnames("b black pointer")}
                  onClick={this.handleLogout}
                >
                  <Button color="dark">Logout</Button>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="12">{address}</Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col>{menu}</Col>
                </Row>
              </TabPane>
              <TabPane tabId="3">
                <Row>
                  <Col>
                    {/* <Card body> */}
                    <CardTitle className="f2 b pl2">Orders</CardTitle>
                    {orders}
                    {/* </Card> */}
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
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

const mapDispatchToProps = (dispatch) => ({
  logoutDispatcher: () => dispatch(logoutDispatcher()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantProfile);
