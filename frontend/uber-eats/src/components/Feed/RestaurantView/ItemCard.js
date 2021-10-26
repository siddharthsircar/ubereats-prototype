import React, { Component } from "react";
import { Button, Card, CardTitle, CardSubtitle } from "reactstrap";
import axios from "axios";
import server from "../../../config";
import { connect } from "react-redux";
import {
  getUserCart,
  emptyCartDispatcher,
} from "../../../redux/actions/orderActions";
import { Redirect } from "react-router";
import Modal from "react-bootstrap/Modal";

class ItemCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item,
      restaurant: this.props.restaurant,
      user: this.props.user,
      item_quantity: 1,
      new_restaurant: false,
      reset_cart: false,
    };
    this.addToCart = this.addToCart.bind(this);
    this.emptyExistingCart = this.emptyExistingCart.bind(this);
  }

  componentDidMount = () => {
    this.setState({
      item: this.props.item,
      restaurant: this.props.restaurant,
      user: this.props.user,
    });
  };

  addToCart = () => {
    let item = this.props.item;
    if (!this.props.authUser || this.props.authUser === undefined) {
      return <Redirect to="/user/login" />;
    } else {
      if (
        (this.props.cart.length !== 0 &&
          this.props.restaurant.rest_id === this.props.cart_summary.rest_id) ||
        this.props.cart_summary.length === 0
      ) {
        let [item_price, cur] = item.item_price.split(" ");
        let total_item_price = (
          this.state.item_quantity * parseFloat(item_price)
        ).toFixed(2);
        let order_total =
          parseFloat(this.props.cart_total) + parseFloat(total_item_price);
        order_total = parseFloat(order_total).toFixed(2);
        let cartPayload = {
          rest_id: this.state.restaurant.rest_id,
          store_name: this.state.restaurant.store_name,
          store_address: `${this.state.restaurant.street_address}, ${this.state.restaurant.city}`,
          cust_name: `${this.state.user.first_name} ${this.state.user.last_name}`,
          cust_address: `${this.state.user.street_address}, ${this.state.user.city}`,
          item_id: item.item_id,
          item_name: item.item_name,
          item_price: total_item_price,
          item_quantity: this.state.item_quantity,
          delivery_mode: this.props.delivery_mode,
          order_status: "cart",
          order_total: `${order_total} ${cur}`,
        };
        axios
          .post(
            `${server}/user/addtocart/${this.state.user.user_id}`,
            cartPayload
          )
          .then((res) => {
            if (res.status === 201) {
              this.props.getUserCart(this.state.user.user_id);
            }
          })
          .catch((errors) => {
            if (errors.response.status === 403) {
              this.setState({ new_restaurant: true });
            } else console.log("Errors: ", errors);
          });
      } else if (
        this.props.cart_summary &&
        this.state.restaurant.rest_id !== this.props.cart_summary.rest_id
      ) {
        this.setState({ new_restaurant: true });
      }
    }
  };

  emptyExistingCart = () => {
    axios
      .delete(`${server}/user/emptycart/${this.props.cart_summary.order_id}`)
      .then((res) => {
        if (res.status === 201) {
          this.props.emptyCartDispatcher();
        }
      })
      .then(() => {
        this.addToCart();
        this.setState({ new_restaurant: false });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          console.log("Cart Empty");
        } else console.log("Error while removing item: ", err.response);
      });
  };

  render() {
    let item = this.props.item;
    let new_cart_modal = null;
    if (this.state.new_restaurant === true) {
      new_cart_modal = (
        <Modal
          show={this.state.new_restaurant}
          onHide={() => {
            this.setState({
              new_restaurant: false,
            });
          }}
        >
          <Modal.Header className="f4 b" closeButton>
            Update Cart
          </Modal.Header>
          <Modal.Body>
            {`Your cart consists of orders from ${this.props.cart_summary.store_name}.\nDo you want to remove these items and create a new order?`}
          </Modal.Body>
          <Modal.Footer>
            <Button
              outline
              color="secondary"
              onClick={() => {
                this.setState({ new_restaurant: false });
              }}
            >
              Cancel
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                this.emptyExistingCart();
              }}
            >
              Continue
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
    return (
      <Card className="shadow-3 ma1">
        {new_cart_modal}
        <div>
          <div className="fl w-80 pa2">
            <CardTitle tag="h5">{item.item_name}</CardTitle>
            <div className="desc" style={{ height: "48px" }}>
              {item.item_desc}
            </div>
            <CardSubtitle tag="h6" className="mb-2 pt2 text-muted">
              {item.item_price}
            </CardSubtitle>
            <button
              className="w-10"
              onClick={() => {
                if (this.state.item_quantity !== 1) {
                  this.setState({
                    item_quantity: this.state.item_quantity - 1,
                  });
                }
              }}
            >
              -
            </button>
            <input
              type="number"
              className="w-10"
              value={this.state.item_quantity}
              onChange={(e) => {
                e.preventDefault();
                this.setState({
                  item_quantity: e.target.value,
                });
              }}
            />
            <button
              className="w-10"
              onClick={() => {
                if (this.state.item_quantity !== 8) {
                  this.setState({
                    item_quantity: this.state.item_quantity + 1,
                  });
                }
              }}
            >
              +
            </button>
            <Button className="ml2" color="primary" onClick={this.addToCart}>
              Add
            </Button>
          </div>
          <div className="pt3 pr1 fl w-20">
            <img
              width="170px"
              height="125px"
              src={item.item_image}
              alt="item-img"
            />
          </div>
        </div>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.auth.user,
  user_id: state.auth.userId,
  cart: state.order.cart,
  cart_total: state.order.cart_total,
  cart_summary: state.order.cart_summary,
  delivery_mode: state.delivery.delivery_mode,
});

const mapDispatchToProps = (dispatch) => ({
  getUserCart: (payload) => dispatch(getUserCart(payload)),
  emptyCartDispatcher: () => dispatch(emptyCartDispatcher()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemCard);
