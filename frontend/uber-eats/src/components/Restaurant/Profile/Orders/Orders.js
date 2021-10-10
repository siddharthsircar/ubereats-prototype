import React, { Component } from "react";
import { connect } from "react-redux";
import { CardTitle, CardText, Row, Col } from "reactstrap";
import server from "../../../../config";
import axios from "axios";
import { Card, DropdownButton, Dropdown, Alert } from "react-bootstrap";
import OrderSummary from "../../../User/Profile/OrderHistory/OrderSummary/OrderSummary";
import { Link } from "react-router-dom";
class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order_status: [],
      orders: "",
      filteredList: "",
      no_orders: "",
      showSummary: false,
      updateOrder: false,
      currentStatusFilter: "All",
      orderStatus: "",
    };
    this.onStatusSelect = this.onStatusSelect.bind(this);
    this.selectOrderStatus = this.selectOrderStatus.bind(this);
    this.getLatestOrders = this.getLatestOrders.bind(this);
  }

  componentDidMount = () => {
    this.getLatestOrders();
  };

  getLatestOrders = () => {
    axios
      .get(`${server}/restaurant/orders/${this.props.user.rest_id}`)
      .then((res) => {
        if (res.status === 200) {
          let order_status = [];
          for (var i = 0; i < res.data.orders.length; i++) {
            if (!order_status.includes(res.data.orders[i].order_status))
              order_status.push(res.data.orders[i].order_status);
          }
          this.setState({
            orders: res.data.orders,
            filteredList: res.data.orders,
            order_status: order_status,
          });
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          alert("You have no past orders");
          this.setState({
            no_orders: "You have no past orders.",
          });
        } else {
          console.log("Error while getting restaurant menu: ", err);
          this.setState({
            no_orders: "You have no past orders.",
          });
        }
      });
  };

  onStatusSelect = (e) => {
    if (e.target.text === "All") {
      this.setState({
        currentStatusFilter: e.target.text,
        filteredList: this.state.orders,
      });
    } else {
      var filteredList = this.state.orders.filter(
        (order) => order.order_status === e.target.text.toLowerCase()
      );
      this.setState({
        currentStatusFilter: e.target.text,
        filteredList: filteredList,
      });
    }
  };

  selectOrderStatus = (e) => {
    e.preventDefault();
    this.setState({
      orderStatus: e.target.text.toLowerCase(),
    });
  };

  updateOrderStatus = (order_id, status) => {
    if (status && status !== null && status !== undefined) {
      console.log(order_id, status);
      let updateData = { order_status: status };
      axios
        .put(`${server}/restaurant/updateorder/${order_id}`, updateData)
        .then((res) => {
          if (res.status === 200) {
            this.getLatestOrders();
          }
        })
        .catch((err) => {
          console.log("Unable to update order: ", err.response);
          alert("Unable to update order");
        });
    } else alert("Select an order status to update order");
  };

  render() {
    let orders = null;
    let statuses = null;
    console.log("Filtered List: ", this.state.filteredList);
    if (this.state.filteredList) {
      let ordercards = this.state.filteredList.map((order) => {
        let createdDate = new Date(order.updatedAt).toLocaleDateString();
        let createdTime = new Date(order.updatedAt).toLocaleTimeString();
        if (order.mode === "delivery") {
          statuses = ["on the way", "delivered"];
        } else statuses = ["ready for pickup", "picked up"];
        return (
          <Card body className="">
            <div className="flex justify-between">
              <div className="flex w-90">
                <div className="ml4">
                  <Card.Text className="f3 b ttc">
                    <Link className="pointer">
                      {order.order_status === "cancelled"
                        ? order.cust_name
                        : `${order.cust_name} (${order.mode})`}
                    </Link>
                    <Card.Subtitle className="i">
                      {`${order.summary.length} items for ${order.order_total}`}
                    </Card.Subtitle>
                  </Card.Text>
                  {order.order_status === "cancelled" ? (
                    <Card.Subtitle className="ttc i red">
                      {order.order_status} by customer.
                    </Card.Subtitle>
                  ) : (
                    <Card.Subtitle className="ttc i">
                      {order.order_status}
                    </Card.Subtitle>
                  )}
                  <Card.Subtitle
                    className="pt2 i underline pointer"
                    onClick={() => {
                      this.setState({ showSummary: true });
                    }}
                  >
                    View Summary
                  </Card.Subtitle>
                </div>
              </div>
              <div className="w-20 center">
                <CardText>{`${createdDate}, ${createdTime}`}</CardText>
                {order.order_status !== "cancelled" ? (
                  this.state.updateOrder === true ? (
                    <div className="flex">
                      <div>
                        <DropdownButton
                          variant="dark"
                          title={this.state.orderStatus || order.order_status}
                          id="status"
                        >
                          <Dropdown.Item
                            id="preparing"
                            onClick={this.selectOrderStatus}
                          >
                            Preparing
                          </Dropdown.Item>
                          {statuses.map((status) => {
                            return (
                              <Dropdown.Item
                                id={status}
                                className="ttc"
                                onClick={this.selectOrderStatus}
                              >
                                {status}
                              </Dropdown.Item>
                            );
                          })}
                        </DropdownButton>
                      </div>
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-check-lg pointer ml4"
                          viewBox="0 0 16 16"
                          onClick={() => {
                            this.updateOrderStatus(
                              order.order_id,
                              this.state.orderStatus
                            );
                            this.setState({ updateOrder: false });
                          }}
                        >
                          <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z" />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-x-lg pointer ml4"
                          viewBox="0 0 16 16"
                          onClick={() => {
                            this.setState({
                              updateOrder: false,
                              orderStatus: "",
                            });
                          }}
                        >
                          <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <CardText
                      className="underline center pointer grow"
                      onClick={() => {
                        this.setState({ updateOrder: true });
                      }}
                    >
                      Update Order
                    </CardText>
                  )
                ) : (
                  <div></div>
                )}
              </div>
            </div>
            {this.state.showSummary ? (
              <OrderSummary
                order_details={order}
                show={this.state.showSummary}
                onHide={() => {
                  this.setState({
                    showSummary: false,
                  });
                }}
              />
            ) : (
              <div></div>
            )}
          </Card>
        );
      });
      orders = (
        <Row>
          <Col>
            <Row>{ordercards}</Row>
          </Col>
        </Row>
      );
    } else
      orders = (
        <CardTitle className="center b">{this.state.no_orders}</CardTitle>
      );
    let statusDropdown = null;
    if (this.state.order_status.length !== 0) {
      let statusOptions = this.state.order_status.map((status) => {
        return (
          <Dropdown.Item className="ttc" onClick={this.onStatusSelect}>
            {status}
          </Dropdown.Item>
        );
      });
      statusDropdown = (
        <DropdownButton
          variant="dark"
          title={this.state.currentStatusFilter}
          id="status"
        >
          <Dropdown.Item className="ttc" onClick={this.onStatusSelect}>
            All
          </Dropdown.Item>
          {statusOptions}
        </DropdownButton>
      );
    }
    return (
      <Card body>
        <div className="flex justify-end pa3">{statusDropdown}</div>
        {orders}
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Orders);
