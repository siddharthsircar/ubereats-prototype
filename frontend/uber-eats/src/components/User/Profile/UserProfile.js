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
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
} from "reactstrap";
import classnames from "classnames";
import "bootstrap/dist/css/bootstrap.min.css";
import Address from "./Address/Address";
import OrderHistory from "./OrderHistory/OrderHistory";
import { logoutDispatcher } from "../../../redux/actions/authAction";
import "./UserProfile.css";
import server from "../../../config";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      user: "",
      activeTab: "1",
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount = () => {
    if (localStorage.getItem("userType") === "customer") {
      this.setState({ authFlag: this.props.authUser });
      let user_id = JSON.parse(localStorage.getItem("user")).user_id;
      axios.get(`${server}/user/profile/${user_id}`).then((res) => {
        this.setState({
          user: res.data.user,
          userId: res.data.user.userId,
        });
      });
    } else if (localStorage.getItem("userType") === "restaurant") {
      this.setState({ authFlag: true });
      let user_id = this.props.location.state.user_id;
      axios.get(`${server}/user/profile/${user_id}`).then((res) => {
        this.setState({
          user: res.data.user,
          userId: res.data.user.userId,
        });
      });
    }
  };

  handleLogout = () => {
    this.props.logoutDispatcher();
    this.setState({ authFlag: false });
  };

  render() {
    const toggle = (tab) => {
      if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
    };
    if (!this.props.authUser) {
      return <Redirect to="/home" />;
    }
    if (localStorage.getItem("userType") !== "customer") {
      // return <Redirect to="/home" />;
    }
    let address = null;
    if (this.state.user) {
      address = <Address userDets={this.state.user} />;
    }
    let orders = null;
    let user_id = null;
    if (localStorage.getItem("userType") === "restaurant") {
      user_id = this.props.location.state.user_id;
    }
    if (this.state.user) {
      orders = <OrderHistory user_id={user_id} />;
    } else orders = <div>You have no past orders</div>;
    return (
      <div className="parent-container">
        <div className="center profile-container">
          <br />
          <div className="user-info">
            <div>
              <div className="full-name b f3 white ma2">
                {this.state.user.first_name + " " + this.state.user.last_name}
              </div>
              <div className="contact-details f5 white em">
                <span className="ma2">{`+1 ${this.state.user.phone_number} • ${this.state.user.email}`}</span>
              </div>
            </div>
            <br />
            <div>
              {localStorage.getItem("userType") !== "customer" ? (
                <div></div>
              ) : (
                <Link to="/user/edit">
                  <Button color="dark">Edit Profile</Button>
                </Link>
              )}
            </div>
          </div>
          <br />
          <div className="br3 shadow-5 bg-white">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames(
                    { active: this.state.activeTab === "1" },
                    "b black hover-black pointer"
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
                    "b black hover-black pointer"
                  )}
                  onClick={() => {
                    toggle("2");
                  }}
                >
                  <p className="black b">Orders</p>
                </NavLink>
              </NavItem>
              {localStorage.getItem("userType") === "restaurant" ? (
                <div></div>
              ) : (
                <NavItem>
                  <NavLink
                    className={classnames(
                      { active: this.state.activeTab === "3" },
                      "b black hover-black pointer"
                    )}
                    onClick={() => {
                      toggle("3");
                    }}
                  >
                    <p className="black b">Favorites</p>
                  </NavLink>
                </NavItem>
              )}
              {localStorage.getItem("userType") === "restaurant" ? (
                <div></div>
              ) : (
                <NavItem>
                  <NavLink
                    className={classnames("b black pointer")}
                    onClick={this.handleLogout}
                  >
                    <Button color="dark">Logout</Button>
                  </NavLink>
                </NavItem>
              )}
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="12">{address}</Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col>
                    <CardTitle className="f2 b pl2">Past Orders</CardTitle>
                    {orders}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="3">
                <Row>
                  <Col>
                    <CardTitle>Favorite Restaurants</CardTitle>
                    <CardText>
                      With supporting text below as a natural lead-in to
                      additional content.
                    </CardText>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
