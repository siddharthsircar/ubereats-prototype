import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-bootstrap/Modal";
import {
  emptyCartDispatcher,
  getUserCart,
} from "../../../../../redux/actions/orderActions";
import { Redirect } from "react-router";

class OrderSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order_details: this.props.order_details,
      showSummary: this.props.show,
    };
  }

  render() {
    if (
      !this.props.authUser ||
      localStorage.getItem("userType") !== "customer"
    ) {
      return <Redirect to="/home" />;
    }
    console.log("Order Details", this.state.order_details);
    let items = null;
    if (this.state.order_details.summary) {
      items = this.state.order_details.summary.map((item) => {
        return (
          <li className="flex items-center lh-copy pa2 ph0-l bb b--black-10">
            <div className="pl3 flex-auto">
              <span className="f4 db black-70">{item.item_name}</span>
              <span className="f6 db i black-70">
                Qty. {item.item_quantity}
              </span>
            </div>
            <div className="f6 i black hover-dark-gray">${item.item_price}</div>
          </li>
        );
      });
    }
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton className="b f4">
          <div className="flex-column">
            <div>Order Summary</div>
            <div className="f6 i">
              Status: {this.state.order_details.order_status}
            </div>
          </div>
        </Modal.Header>
        <div className="b f4 pa2 pl3">
          {this.state.order_details.store_name}
        </div>
        {this.state.order_details.order_status !== "cancelled" ? (
          <div className="b f6 ttc pl3">
            {this.state.order_details.mode} :{" "}
            {this.state.order_details.mode === "delivery"
              ? this.state.order_details.cust_address
              : this.state.order_details.store_address}
          </div>
        ) : (
          <div></div>
        )}

        <Modal.Body>{items}</Modal.Body>
        <Modal.Footer className="b f3">
          Order Total: ${this.state.order_details.order_total.split(" ")[0]}
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  user_id: state.auth.userId,
});

const mapDispatchToProps = (dispatch) => ({
  emptyCartDispatcher: () => dispatch(emptyCartDispatcher()),
  getUserCart: (payload) => dispatch(getUserCart(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);
