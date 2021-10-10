import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Row, Col } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import server from "../../../config";
import "./RestaurantView.css";
import ItemCard from "./ItemCard";
import { DropdownButton, Dropdown } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";

class RestaurantView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guest: this.props.location.state.guest,
      restaurantId: this.props.location.state.restaurant.rest_id,
      restaurant: "",
      menu: "",
      filteredMenu: "",
      activeTab: "1",
      categories: "",
      types: "",
      currentDietFilter: "All",
      favorite: false,
    };
    this.markFavorite = this.markFavorite.bind(this);
    this.onDietSelect = this.onDietSelect.bind(this);
  }

  componentDidMount = () => {
    axios
      .get(`${server}/restaurant/profile/${this.state.restaurantId}`)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            restaurant: res.data.user,
          });
          axios
            .get(`${server}/menu/items/${this.state.restaurantId}`)
            .then((res) => {
              if (res.status === 200) {
                let item_categories = [];
                let item_types = [];
                for (var i = 0; i < res.data.menu.length; i++) {
                  if (!item_categories.includes(res.data.menu[i].category))
                    item_categories.push(res.data.menu[i].category);
                  if (!item_types.includes(res.data.menu[i].item_type))
                    item_types.push(res.data.menu[i].item_type);
                }
                this.setState({
                  menu: res.data.menu,
                  filteredMenu: res.data.menu,
                  categories: item_categories,
                  types: item_types,
                });
              } else {
                console.log("Error while getting menu: ", res.data);
                <Alert variant="danger">Error while getting menu</Alert>;
              }
            })
            .catch((err) => {
              console.log("Error while getting restaurant menu: ", err);
              <Alert variant="danger">Internal Server Error</Alert>;
            });
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          console.log(err.response.data);
          <Alert variant="danger">
            Restaurant you are trying to view does not exist.
          </Alert>;
        } else {
          console.log("Error while getting restaurant profile: ", err);
          <Alert variant="danger">Unable to get restaurant profile</Alert>;
        }
      });
  };

  markFavorite = () => {
    console.log("Favorite Before Toggle: ", this.state.favorite);
    this.setState({ favorite: !this.state.favorite });
    console.log("Favorite After Toggle: ", this.state.favorite);
    if (this.state.favorite === true) {
      axios
        .post(
          `${server}/user/favorite/${this.props.userId}?rest_id=${this.state.restaurantId}`
        )
        .then((res) => {
          if (res.status === 201) {
            <Alert variant="success">Restaurant Marked as Favorite</Alert>;
          }
        })
        .catch((err) => {
          console.log("Error while marking restaurant as favorite: ", err);
          this.setState({ favorite: false });
          <Alert variant="danger">Unable to mark Restaurant as Favorite</Alert>;
        });
    } else if (this.state.favorite === false) {
      axios
        .delete(
          `${server}/user/favorite/${this.props.userId}?rest_id=${this.state.restaurantId}`
        )
        .then((res) => {
          if (res.status === 201) {
            <Alert variant="success">Restaurant removed from Favorites</Alert>;
          }
        })
        .catch((err) => {
          console.log("Error while removing restaurant as favorite: ", err);
          this.setState({ favorite: true });
          <Alert variant="danger">
            Unable to remove restaurant from Favorite
          </Alert>;
        });
    }
  };

  onDietSelect = (e) => {
    e.preventDefault();
    let diet = e.target.id.toLowerCase();
    if (diet === "all") {
      this.setState({
        filteredMenu: this.state.menu,
        currentDietFilter: e.target.text,
      });
    } else {
      let filteredList = this.state.menu.filter(
        (item) => item.item_type === diet
      );
      this.setState({
        filteredMenu: filteredList,
        currentDietFilter: e.target.text,
      });
    }
  };

  render() {
    if (
      this.state.guest !== true &&
      this.props.authUser === true &&
      localStorage.getItem("userType") !== "customer"
    ) {
      return <Redirect to="/home" />;
    }
    let image_url = "";
    if (this.state.restaurant.store_image) {
      image_url = this.state.restaurant.store_image;
    }
    let items = null;
    if (this.state.filteredMenu.length !== 0) {
      let menuCards = this.state.filteredMenu.map((item) => {
        return (
          <Col>
            <ItemCard
              item={item}
              restaurant={this.state.restaurant}
              user={this.props.user}
            />
          </Col>
        );
      });
      items = (
        <Row xs="3" className="pa3 menu-container">
          {menuCards}
        </Row>
      );
    } else
      items = <div className="h2 b flex justify-center">No Items in menu.</div>;

    let color = null;
    if (this.state.favorite === false) {
      color = "red";
    } else color = "white";
    let dietaryDropdown = null;
    if (this.state.types.length !== 0) {
      let dietaryOptions = this.state.types.map((type) => {
        return (
          <Dropdown.Item id={type} onClick={this.onDietSelect}>
            {type === "nonveg"
              ? "Non-Vegetarian"
              : type === "veg"
              ? "Vegetarian"
              : type === "vegan"
              ? "Vegan"
              : ""}
          </Dropdown.Item>
        );
      });
      dietaryDropdown = (
        <DropdownButton
          variant="dark"
          title={this.state.currentDietFilter}
          id="dietary"
        >
          <Dropdown.Item id="all" onClick={this.onDietSelect}>
            All
          </Dropdown.Item>
          {dietaryOptions}
        </DropdownButton>
      );
    }
    return (
      <div className="parent">
        <div className="center">
          <div
            className="flex justify-between items-end rest-details pb3 pt3 pl4 br2"
            style={{
              backgroundImage: `url(${image_url})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              height: "30vh",
            }}
          >
            <div>
              <div className="store-name b f3 white">
                {`${this.state.restaurant.store_name} (${this.state.restaurant.street_address})`}
              </div>
              <div className="contact-details white em">
                <span className="ma2">{`+1 ${this.state.restaurant.phone_number} • ${this.state.restaurant.email}`}</span>
                <br />
                <span className="ma2">{`${this.state.restaurant.city}, ${this.state.restaurant.state}`}</span>
                <br />
                <span className="ma2">{`Timings: ${this.state.restaurant.timings}`}</span>
              </div>
            </div>
            <br />
            <div className="pr4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill={`${color}`}
                class="bi bi-suit-heart-fill"
                viewBox="0 0 16 16"
                onClick={this.markFavorite}
              >
                <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z" />
              </svg>
            </div>
          </div>
          <div className="flex justify-start items-center pt2 pl3 pa2">
            <label className="f4 mr3 b i">Dietary</label>
            {dietaryDropdown}
          </div>
          <div className="bg-white" width="100%">
            {items}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  userId: state.auth.userId,
  user: state.auth.user,
});

export default connect(mapStateToProps)(RestaurantView);
