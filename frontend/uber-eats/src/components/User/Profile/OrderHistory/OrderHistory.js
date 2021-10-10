import React, { Component } from "react";
import { connect } from "react-redux";
import { CardTitle, CardText, Row, Col } from "reactstrap";
import server from "../../../../config";
import axios from "axios";
import { Card, DropdownButton, Dropdown, Alert } from "react-bootstrap";
import OrderSummary from "./OrderSummary/OrderSummary";
class OrderHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order_status: [],
      orders: "",
      filteredList: "",
      no_orders: "",
      showSummary: false,
    };
    this.onStatusSelect = this.onStatusSelect.bind(this);
    this.getLatestOrders = this.getLatestOrders.bind(this);
  }

  componentDidMount = () => {
    this.getLatestOrders();
  };

  getLatestOrders = () => {
    let user_id = null;
    if (localStorage.getItem("userType") === "customer") {
      user_id = this.props.user.user_id;
    } else if (localStorage.getItem("userType") === "restaurant") {
      user_id = this.props.user_id;
    }
    axios
      .get(`${server}/user/orders/${user_id}`)
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
        filteredList: this.state.orders,
      });
    } else {
      var filteredList = this.state.orders.filter(
        (order) => order.order_status === e.target.text.toLowerCase()
      );
      this.setState({
        filteredList: filteredList,
      });
    }
  };

  render() {
    let orders = null;
    console.log("Filtered List: ", this.state.filteredList);
    if (this.state.filteredList) {
      let ordercards = this.state.filteredList.map((order) => {
        let createdDate = new Date(order.updatedAt).toLocaleDateString();
        let createdTime = new Date(order.updatedAt).toLocaleTimeString();
        return (
          <Card body className="">
            <div className="flex justify-between">
              <div className="flex w-90">
                <div className="ml4">
                  <Card.Text className="f3 b">
                    {`${order.store_name} (${order.store_address})`}
                    <Card.Subtitle className="i">
                      {`${order.summary.length} items for ${order.order_total}`}
                    </Card.Subtitle>
                  </Card.Text>
                  {order.order_status === "cancelled" ? (
                    <Card.Subtitle className="ttc i red">
                      {order.order_status}
                    </Card.Subtitle>
                  ) : (
                    <Card.Subtitle className="ttc i">
                      {order.order_status}
                    </Card.Subtitle>
                  )}
                  {localStorage.getItem("userType") === "restaurant" ? (
                    <div></div>
                  ) : (
                    <Card.Subtitle
                      className="pt2 i underline pointer"
                      onClick={() => {
                        this.setState({ showSummary: true });
                      }}
                    >
                      View Summary
                    </Card.Subtitle>
                  )}
                </div>
              </div>
              <div className="w-10 center">
                <CardText>{`${createdDate}, ${createdTime}`}</CardText>
                {localStorage.getItem("userType") === "restaurant" ? (
                  <div></div>
                ) : order.order_status === "order placed" ? (
                  <CardText
                    className="underline red pointer grow"
                    onClick={() => {
                      axios
                        .put(`${server}/user/cancelorder/${order.order_id}`)
                        .then((res) => {
                          if (res.status === 200) {
                            this.getLatestOrders();
                            alert("Order Cancelled");
                          }
                        })
                        .catch((err) => {
                          console.log("Unable to cancel order: ", err.response);
                          alert("Unable to cancel order");
                        });
                    }}
                  >
                    Cancel Order
                  </CardText>
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
          <Dropdown.Item href="#" className="ttc" onClick={this.onStatusSelect}>
            {status}
          </Dropdown.Item>
        );
      });
      statusDropdown = (
        <DropdownButton variant="dark" title="Status" id="status">
          <Dropdown.Item href="#" onClick={this.onStatusSelect}>
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

export default connect(mapStateToProps)(OrderHistory);
