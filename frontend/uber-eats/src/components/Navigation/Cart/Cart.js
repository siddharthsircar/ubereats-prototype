import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { getUserCart } from "../../../redux/actions/orderActions";
import axios from "axios";
import server from "../../../config";
import { Link } from "react-router-dom";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: this.props.cart,
      total_items: this.props.total_items,
      cart_total: this.props.cart_total,
      showSummary: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.removeAll = this.removeAll.bind(this);
  }

  handleClick = (value) => {
    this.setState({ showSummary: value });
  };

  removeAll = () => {
    axios
      .delete(`${server}/user/emptycart/${this.props.cart[0].order_id}`)
      .then((res) => {
        if (res.status === 201) {
          this.props.getUserCart(this.props.user_id);
        }
      })
      .catch((err) => {
        console.log("Error while removing item: ", err.response);
      });
  };

  render() {
    let cartItems = null;
    if (this.props.total_items === 0) {
      cartItems = <Modal.Body>No items in your Cart.</Modal.Body>;
    } else {
      let items = this.props.cart.map((item) => {
        return (
          <div className="flex justify-between items-center mb2">
            <div>{`${item.item_name} x ${item.item_quantity}`}</div>
            <div className="flex">
              <div>{item.item_price}</div>
              <div className="pl2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-trash-fill pointer"
                  viewBox="0 0 16 16"
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
                        console.log(
                          "Error while removing item: ",
                          err.response
                        );
                      });
                  }}
                >
                  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                </svg>
              </div>
            </div>
          </div>
        );
      });
      cartItems = (
        <div>
          <div className="flex justify-between pa3 bb items-center">
            <div className="f3 b i">{this.props.store_name}</div>
            <div className="i underline pointer grow" onClick={this.removeAll}>
              Remove all items
            </div>
          </div>
          <Modal.Body>{items}</Modal.Body>
          <Modal.Footer>
            <Link
              to={{
                pathname: "/checkout",
                state: { order_id: this.props.cart[0].order_id },
              }}
            >
              <Button variant="dark" onClick={this.props.closeSummary}>
                Checkout • ${this.props.cart_total}
              </Button>
            </Link>
          </Modal.Footer>
        </div>
      );
    }
    return (
      <div>
        <nav className="ma3" onClick={this.props.openSummary}>
          <button
            id="cart"
            className="border-0 br4 pa2 pr3 pl3 b grow black link pointer flex"
          >
            <div className="mb1 h6">
              <img
                src="https://img.icons8.com/ios/20/000000/shopping-cart.png"
                alt="cart-icn"
              />
            </div>
            <div className="ml3 mb0 f5">{`Cart  •  ${this.props.total_items}`}</div>
          </button>
        </nav>
        <Modal show={this.props.summary} onHide={this.props.closeSummary}>
          <Modal.Header closeButton>
            <p className="h2 b">Cart</p>
          </Modal.Header>
          {cartItems}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  store_name: state.order.store_name,
  cart: state.order.cart,
  total_items: state.order.total_items,
  cart_total: state.order.cart_total,
  user_id: state.auth.userId,
});

const mapDispatchToProps = (dispatch) => ({
  getUserCart: (payload) => dispatch(getUserCart(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
