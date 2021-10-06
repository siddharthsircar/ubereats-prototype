import React, { Component } from "react";
import { Redirect } from "react-router-dom";
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
import Menu from "./Menu/Menu";
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
      axios.get(`${server}/restaurant/profile/${rest_id}`).then((res) => {
        this.setState({
          restaurant: res.data.user,
          restaurantId: res.data.user.userId,
        });
        axios.get(`${server}/menu/items/${rest_id}`).then((res) => {
          this.setState({
            menu: res.data.menu,
          });
        });
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
    let address = null;
    if (this.state.restaurant) {
      address = <Address userDets={this.state.restaurant} />;
    }
    let menu = "No Items Added Yet";
    if (this.state.menu) {
      console.log("Menu: ", this.state.menu);
      menu = <Menu menu={this.state.menu} />;
    }
    return (
      <div className="parent-container">
        <div className="center profile-container">
          <br />
          <div className="user-info">
            <div>
              <div className="full-name b f3 white">
                {this.state.restaurant.store_name}
              </div>
              <div className="contact-details white em">
                <span>+1 {this.state.restaurant.phone_number}</span>
                <span> . {this.state.restaurant.email}</span>
              </div>
            </div>
            <br />
            <div>
              <Button className="white">Edit Profile</Button>
            </div>
          </div>
          <br />
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
              <NavItem>
                <NavLink
                  className={classnames("b black pointer")}
                  onClick={this.handleLogout}
                >
                  <p className="black b">Logout</p>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="12">
                    {/* <Address userProp={this.state.user} /> */}
                    {address}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col sm="6">
                    <Card body>{menu}</Card>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="3">
                <Row>
                  <Col sm="6">
                    <Card body>
                      <CardTitle>Special Title Treatment</CardTitle>
                      <CardText>
                        With supporting text below as a natural lead-in to
                        additional content.
                      </CardText>
                      <Button>Go somewhere</Button>
                    </Card>
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
