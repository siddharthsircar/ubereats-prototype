import React, { Component } from "react";
import { Button, Card } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Checkout.css";
import { connect } from "react-redux";
import Modal from "react-bootstrap/Modal";
import {
  emptyCartDispatcher,
  getUserCart,
} from "../../../redux/actions/orderActions";
import { Redirect } from "react-router";
import axios from "axios";
import server from "../../../config";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { states, cities, countries } from "../../../places";
class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      street_address: "",
      city: "San Jose",
      zip: "",
      state: "California",
      country: "United States",
      delivery: true,
      delivery_mode: "delivery",
      showSuccess: false,
      store_name: this.props.cart_summary.store_name,
      delivery_address: this.props.cart_summary.cust_address,
      new_address: false,
      addresses: [this.props.cart_summary.cust_address],
    };
    this.placeOrder = this.placeOrder.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }

  //   componentDidMount = () => {};

  placeOrder = () => {
    let updatData = {
      cust_address: this.state.delivery_address,
      mode: this.state.delivery_mode,
      order_status: "order placed",
    };
    axios
      .put(
        `${server}/user/checkout/${this.props.location.state.order_id}`,
        updatData
      )
      .then((res) => {
        if (res.status === 200) {
          this.setState({ showSuccess: true });
        }
      });
  };

  inputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value, showError: false });
  };

  render() {
    if (
      !this.props.authUser ||
      localStorage.getItem("userType") !== "customer"
    ) {
      return <Redirect to="/home" />;
    }

    if (this.props.cart_total === 0) {
      return <Redirect to="/user/feed" />;
    }
    let selectState = null;
    selectState = states.map((state) => {
      return (
        <option className="ttc" value={state}>
          {state}
        </option>
      );
    });
    let selectCity = null;
    selectCity = cities.map((city) => {
      return (
        <option className="ttc" value={city}>
          {city}
        </option>
      );
    });
    let selectCountry = null;
    selectCountry = countries.map((country) => {
      return (
        <option className="ttc" value={country}>
          {country}
        </option>
      );
    });
    let addresses = [];
    for (let i = 0; i < this.state.addresses.length; i++) {
      addresses.push(this.state.addresses[i]);
    }
    let addressList = addresses.map((address) => {
      return (
        <div>
          <Form.Check
            inline
            checked={this.state.delivery_address === address}
            label={address}
            name="delivery_address"
            type="radio"
            value={address}
            onChange={() => {
              this.setState({ delivery_address: address });
            }}
          />
        </div>
      );
      // <div className="ma2 pa3 ba pointer mt3">{address}</div>;
    });
    let order_address = null;
    if (this.state.delivery_mode === "delivery") {
      order_address = (
        <Card.Text className="pa2 i h-50">
          Delivery Address:
          <Card.Text className="pa2 i">
            <label>
              Home Address
              {addressList}
              <br />
              {this.state.new_address === false ? (
                <Card.Subtitle
                  className="pointer underline grow"
                  onClick={() => {
                    this.setState({ new_address: true });
                  }}
                >
                  Add New Address
                </Card.Subtitle>
              ) : (
                <Modal
                  show={this.state.new_address}
                  onHide={() => {
                    this.setState({
                      new_address: false,
                    });
                  }}
                >
                  <Modal.Header closeButton className="b f3">
                    New Address
                  </Modal.Header>
                  <Modal.Body>
                    <div>
                      <div className="mt3">
                        <label
                          className="db fw6 lh-copy f5"
                          htmlFor="street_address"
                        >
                          Street Address
                        </label>
                        <input
                          className="pa2 input-reset ba bg-transparent w-100"
                          type="text"
                          name="street_address"
                          id="street_address"
                          value={this.state.street_address}
                          onChange={this.inputChange}
                          required
                        />
                      </div>
                      <div className="mt3">
                        <label className="db fw6 lh-copy f5" htmlFor="city">
                          City
                        </label>
                        <select
                          className="b pa2 input-reset ba bg-transparent w-100"
                          name="city"
                          id="city"
                          value={this.state.city}
                          onChange={this.inputChange}
                          required
                        >
                          {selectCity}
                        </select>
                      </div>
                      <div className="mt3">
                        <label className="db fw6 lh-copy f5" htmlFor="zip">
                          Zip Code
                        </label>
                        <input
                          className="pa2 input-reset ba bg-transparent w-100"
                          type="text"
                          name="zip"
                          id="zip"
                          value={this.state.zip}
                          onChange={this.inputChange}
                          required
                        />
                      </div>
                      <div className="mt3">
                        <label className="db fw6 lh-copy f5" htmlFor="state">
                          State
                        </label>
                        <select
                          className="b pa2 input-reset ba bg-transparent w-100"
                          name="state"
                          id="state"
                          value={this.state.state}
                          onChange={this.inputChange}
                          required
                        >
                          {selectState}
                        </select>
                      </div>
                      <div className="mt3">
                        <label className="db fw6 lh-copy f5" htmlFor="country">
                          Country
                        </label>
                        <select
                          className="b pa2 input-reset ba bg-transparent w-100"
                          name="country"
                          id="country"
                          value={this.state.country}
                          onChange={this.inputChange}
                          required
                        >
                          {selectCountry}
                        </select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Card.Subtitle
                      className="pointer underline grow"
                      onClick={() => {
                        this.setState({
                          addresses: [
                            ...this.state.addresses,
                            `${this.state.street_address}, ${this.state.city}`,
                          ],
                          new_address: false,
                        });
                      }}
                    >
                      Add Address
                    </Card.Subtitle>
                  </Modal.Footer>
                </Modal>
              )}
            </label>
          </Card.Text>
        </Card.Text>
      );
    } else if (this.state.delivery_mode === "pickup") {
      order_address = (
        <Card.Text className="pa2 i h-50">
          Pickup Address:
          <Card.Text className="pa2 i">
            Store Address
            <Card.Subtitle>
              {this.props.cart_summary.store_address}
            </Card.Subtitle>
          </Card.Text>
        </Card.Text>
      );
    }
    let items = null;
    if (this.props.cart_summary) {
      items = this.props.cart_summary.cart_summary.map((item) => {
        return (
          <li className="flex items-center lh-copy pa3 ph0-l bb b--black-10">
            <div className="pl3 flex-auto">
              <span className="f4 db black-70">{item.item_name}</span>
              <span className="f6 db black-70">${item.item_price}</span>
            </div>
            <div
              className="f6 i pointer link black underline hover-dark-gray"
              onClick={() => {
                axios
                  .delete(
                    `${server}/user/removeitem/${this.props.user_id}?item_id=${item.item_id}&item_price=${item.item_price}`
                  )
                  .then((res) => {
                    if (res.status === 201) {
                      this.props.getUserCart(this.props.user_id);
                    }
                  })
                  .catch((err) => {
                    console.log("Error while removing item: ", err.response);
                  });
              }}
            >
              remove
            </div>
          </li>
        );
      });
    }
    return (
      <div className="checkout-parent">
        <Row>
          <Col lg="1"></Col>
          <Col lg="6" className="pa2">
            <Card body>
              <div id="store_name" className="f2 pl4 b i bb dark-gray">
                {`${this.props.cart_summary.store_name} (${this.props.cart_summary.store_address})`}
              </div>
              <div className="ma2">{items}</div>
              <div className="instructions ma2 pa3">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Delivery Instructions</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>
              </div>
            </Card>
          </Col>
          <Col className="center pt2 pr4" xs lg="3">
            <Card className="pa2 pb3 h-100">
              <Card.Header className="f3 b h-30">Order Summary</Card.Header>
              <Card.Text className="pa2 f5 i h-40">
                Choose Mode of Delivery:
                <div>
                  <Form.Check
                    inline
                    checked={this.state.delivery_mode === "delivery"}
                    label="Delivery"
                    name="mode"
                    type="radio"
                    value="delivery"
                    onChange={() => {
                      this.setState({ delivery_mode: "delivery" });
                    }}
                  />
                  <Form.Check
                    inline
                    checked={this.state.delivery_mode === "pickup"}
                    label="Pickup"
                    name="mode"
                    type="radio"
                    value="pickup"
                    onChange={() => {
                      this.setState({ delivery_mode: "pickup" });
                    }}
                  />
                </div>
              </Card.Text>
              {order_address}
              <Card.Footer>
                <div className="flex justify-between pa3 h3 bt">
                  <div>Order Total</div>
                  <div>${this.props.cart_total}</div>
                </div>
                <Button
                  className="w-80"
                  variant="success"
                  size="lg"
                  onClick={this.placeOrder}
                >
                  Place Order
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Modal
          show={this.state.showSuccess}
          onHide={() => {
            this.setState({
              showSuccess: false,
            });
          }}
        >
          <Modal.Header closeButton>Order Placed</Modal.Header>
          <Modal.Body>
            {`Your order has been placed with ${this.state.store_name}. Track Your orders in the Order page in your profile`}
          </Modal.Body>
          <Modal.Footer>
            <Link to="/user/profile">
              <Button
                variant="success"
                onClick={() => {
                  this.props.emptyCartDispatcher();
                  this.setState({ showSuccess: false });
                }}
              >
                Continue
              </Button>
            </Link>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  user_id: state.auth.userId,
  cart_summary: state.order.cart_summary,
  cart_total: state.order.cart_total,
});

const mapDispatchToProps = (dispatch) => ({
  emptyCartDispatcher: () => dispatch(emptyCartDispatcher()),
  getUserCart: (payload) => dispatch(getUserCart(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
