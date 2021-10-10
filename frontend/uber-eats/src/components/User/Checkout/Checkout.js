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

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delivery: true,
      delivery_mode: "delivery",
      showSuccess: false,
      store_name: this.props.cart_summary.store_name,
    };
    this.placeOrder = this.placeOrder.bind(this);
  }

  //   componentDidMount = () => {};

  placeOrder = () => {
    axios
      .put(
        `${server}/user/checkout/${this.props.location.state.order_id}?mode=${this.state.delivery_mode}`
      )
      .then((res) => {
        if (res.status === 200) {
          this.setState({ showSuccess: true });
        }
      });
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
    let order_address = null;
    if (this.state.delivery_mode === "delivery") {
      order_address = (
        <Card.Text className="pa2 i h-50">
          Delivery Address:
          <Card.Text className="pa2 i">
            <label>
              Home Address
              <Card.Subtitle>
                {this.props.cart_summary.cust_address}
              </Card.Subtitle>
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
              <span className="f6 db black-70">{item.item_price}</span>
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
