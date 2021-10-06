import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: "0",
      showSummary: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (value) => {
    this.setState({ showSummary: value });
  };

  render() {
    let cartItems = null;
    if (this.state.cartItems === "0") {
      cartItems = <Modal.Body>No items in your Cart.</Modal.Body>;
    } else {
      cartItems = (
        <div>
          <Modal.Body>No items in your Cart.</Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={this.props.closeSummary}>
              Order Summary
            </Button>
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
            <div className="ml3 mb0 f5">{`Cart  •  ${this.state.cartItems}`}</div>
          </button>
        </nav>
        <Modal show={this.props.summary} onHide={this.props.closeSummary}>
          <Modal.Header closeButton>
            <p className="h2">Cart</p>
          </Modal.Header>
          {cartItems}
        </Modal>
      </div>
    );
  }
}

export default UserProfile;
