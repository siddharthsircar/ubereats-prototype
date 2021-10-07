import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, Button, CardTitle, CardText, Row, Col } from "reactstrap";
import server from "../../../../config";
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item_image: [],
      item_name: "",
      item_desc: "",
      item_type: "veg",
      category: "breakfast",
      item_price: "",
      menu: "",
      edit: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = () => {
    axios
      .get(`${server}/menu/items/${this.props.user.rest_id}`)
      .then((res) => {
        if (res.status === 200) {
          let item_categories = [];
          for (var i = 0; i < res.data.menu.length; i++) {
            if (!item_categories.includes(res.data.menu[i].category))
              item_categories.push(res.data.menu[i].category);
          }
          this.setState({
            menu: res.data.menu,
          });
        } else console.log("Error while getting menu: ", res.data);
      })
      .then(this.setState({ edit: false }))
      .catch((err) => {
        console.log("Error while getting restaurant menu: ", err);
        alert("Internal Server Error");
      });
  };

  handleClick = (e) => {
    if (e.target.id === "save" || e.target.id === "cancel") {
      this.setState({
        edit: false,
      });
    } else if (e.target.id === "add") {
      this.setState({
        edit: true,
      });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!this.state.item_image) {
        alert("Select a file first!");
      }
      const formData = new FormData();
      formData.append("file", this.state.item_image[0]);
      await axios
        .post(`${server}/menu/item/uploadImage`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const data = {
            menu_id: this.props.user.rest_id,
            item_image: res.data.Location,
            item_name: this.state.item_name,
            item_desc: this.state.item_desc,
            item_type: this.state.item_type,
            category: this.state.category,
            item_price: this.state.item_price,
          };
          axios
            .post(`${server}/menu/item`, data)
            .then((res) => {
              if (res.status === 201) {
                axios
                  .get(`${server}/menu/items/${this.props.user.rest_id}`)
                  .then((res) => {
                    if (res.status === 200) {
                      let item_categories = [];
                      for (var i = 0; i < res.data.length; i++) {
                        if (!item_categories.includes(res.data[i].category))
                          item_categories.push(res.data[i].category);
                      }
                      this.setState({
                        menu: res.data.menu,
                      });
                    } else console.log("Error while getting menu: ", res.data);
                  })
                  .then(this.setState({ edit: false }))
                  .catch((err) => {
                    console.log("Error while getting restaurant menu: ", err);
                    alert("Unable to get restaurant menu");
                  });
              } else console.log(res);
            })
            .catch((errors) => {
              if (errors.response.data) {
                this.setState({ error: errors.response.data.errors.message });
              } else {
                console.log("Error while adding menu item: ", errors);
                alert("Unable to add item");
              }
            });
        });
    } catch (error) {
      console.log("Upload Image Error: ", error);
    }
  };

  inputChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      error: "",
    });
  };

  render() {
    let addItem = null;
    let error = null;
    if (this.state.error !== "" && this.state.error !== undefined) {
      error = <p className="red b">{this.state.error}</p>;
    }
    if (this.state.edit === true) {
      addItem = (
        <div className="">
          <form className="measure center mt0 pt0" onSubmit={this.handleSubmit}>
            <fieldset id="add-item" className="ba b--transparent ph0 mh0">
              <div className="mv3">
                <label className="db fw6 lh-copy f5" htmlFor="item_image">
                  Image
                </label>
                <input
                  className="input-reset bg-transparent  w-100"
                  type="file"
                  name="item_image"
                  id="item_image"
                  onChange={(event) =>
                    this.setState({ item_image: event.target.files })
                  }
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f5" htmlFor="item_name">
                  Name
                </label>
                <input
                  className="input-reset ba bg-transparent  w-100"
                  type="text"
                  name="item_name"
                  id="item_name"
                  value={this.state.item_name}
                  onChange={this.inputChange}
                  required
                  autoFocus
                />
                {error}
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f5" htmlFor="item_desc">
                  Description
                </label>
                <input
                  className="input-reset ba bg-transparent  w-100"
                  type="textarea"
                  name="item_desc"
                  id="item_desc"
                  value={this.state.item_desc}
                  onChange={this.inputChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f5" htmlFor="item_type">
                  Type
                </label>
                <select
                  name="item_type"
                  id="item_type"
                  value={this.state.item_type}
                  onChange={this.inputChange}
                  required
                >
                  <option value="veg">Vegetarian</option>
                  <option value="nonveg">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f5" htmlFor="category">
                  Meal Category
                </label>
                <select
                  name="category"
                  id="category"
                  value={this.state.category}
                  onChange={this.inputChange}
                  required
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="sides">Sides</option>
                  <option value="drinks">Drink</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f5" htmlFor="item_price">
                  Price
                </label>
                <input
                  className="input-reset ba bg-transparent"
                  type="number"
                  name="item_price"
                  id="item_price"
                  value={this.state.item_price}
                  onChange={this.inputChange}
                  required
                />
              </div>
            </fieldset>
            <div className="buttons">
              <Button
                className="mr3"
                id="cancel"
                color="secondary"
                onClick={this.handleClick}
              >
                Cancel
              </Button>
              <Button className="ml3" type="submit" id="save" color="primary">
                Save
              </Button>
            </div>
          </form>
        </div>
      );
    }
    let items = null;
    let addItemButton = null;
    if (!this.state.edit) {
      addItemButton = (
        <Button id="add" color="primary" onClick={this.handleClick}>
          Add Items
        </Button>
      );
      if (this.state.menu) {
        let menuCards = this.state.menu.map((item) => {
          return (
            <Accordion defaultActiveKey="1">
              <Accordion.Item eventKey="0">
                <Accordion.Header>{item.item_name}</Accordion.Header>
                <Accordion.Body>
                  <Card body>
                    <div className="flex justify-between">
                      <div className="flex w-90">
                        <img
                          className="w-10 h-10"
                          src={item.item_image}
                          alt="item-img"
                        />
                        <div className="ml4">
                          <CardText className="b">{item.item_name}</CardText>
                          <CardText>{item.item_desc}</CardText>
                        </div>
                      </div>
                      <div className="w-10 center">
                        <CardText>{item.item_price}</CardText>
                      </div>
                    </div>
                  </Card>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          );
        });
        items = (
          <Row>
            <Col>
              <Row>{menuCards}</Row>
            </Col>
          </Row>
        );
      } else items = <CardText>No Items in menu.</CardText>;
    }
    return (
      <Card body>
        <div className="flex justify-between bb">
          <CardTitle className="f2 b">Store Menu</CardTitle>
          {addItemButton}
        </div>
        {addItem}
        {items}
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Menu);
