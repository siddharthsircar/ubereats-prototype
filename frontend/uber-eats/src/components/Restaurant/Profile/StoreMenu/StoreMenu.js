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
      category: "main course",
      item_price: "",
      menu: "",
      edit: false,
      editItem: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateItem = this.updateItem.bind(this);
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
                        item_image: [],
                        item_name: "",
                        item_desc: "",
                        item_price: "",
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

  updateItem = (item_id, item_name, item_desc, item_price) => {
    let updateData = {};
    if (item_name !== null && item_name !== undefined && item_name) {
      updateData["item_name"] = item_name;
    }
    if (item_desc !== null && item_desc !== undefined && item_desc) {
      updateData["item_desc"] = item_desc;
    }
    if (item_price !== null && item_price !== undefined && item_price) {
      updateData["item_price"] = `${item_price} $`;
    }
    console.log("UpdateData: ", updateData);
    axios
      .put(`${server}/menu/item/${item_id}`, updateData)
      .then((response) => {
        if (response.status === 200) {
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
                  item_image: [],
                  item_name: "",
                  item_desc: "",
                  item_price: "",
                });
              } else console.log("Error while getting menu: ", res.data);
            })
            .then(this.setState({ edit: false }))
            .catch((err) => {
              console.log("Error while getting restaurant menu: ", err);
              alert("Unable to get restaurant menu");
            });
        } else console.log("Update Item err res: ", response);
      })
      .catch((err) => {
        console.log("Error while updating item", err);
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
                  <option value="appetizer">Appetizer</option>
                  <option value="salads">Salad</option>
                  <option value="main-course">Main Course</option>
                  <option value="sides">Sides</option>
                  <option value="beverages">Beverage</option>
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
                          {this.state.editItem === true ? (
                            <input
                              className="input-reset ba bg-transparent  w-100"
                              type="text"
                              name="item_name"
                              id="item_name"
                              placeholder={item.item_name}
                              value={this.state.item_name}
                              onChange={this.inputChange}
                              required
                              autoFocus
                            />
                          ) : (
                            <CardText className="b">{item.item_name}</CardText>
                          )}
                          {this.state.editItem === true ? (
                            <input
                              className="input-reset ba bg-transparent  w-100"
                              type="text"
                              name="item_desc"
                              id="item_desc"
                              placeholder={item.item_desc}
                              value={this.state.item_desc}
                              onChange={this.inputChange}
                              required
                              autoFocus
                            />
                          ) : (
                            <CardText>{item.item_desc}</CardText>
                          )}
                        </div>
                      </div>
                      <div className="w-10 center">
                        {this.state.editItem === true ? (
                          <input
                            className="input-reset ba bg-transparent  w-100"
                            type="number"
                            name="item_price"
                            id="item_price"
                            placeholder={item.item_price}
                            value={this.state.item_price}
                            onChange={this.inputChange}
                            required
                            autoFocus
                          />
                        ) : (
                          <CardText>{item.item_price}</CardText>
                        )}
                      </div>
                      <div className="w-10 center">
                        {this.state.editItem === true ? (
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-check-lg pointer ml4"
                              viewBox="0 0 16 16"
                              onClick={() => {
                                this.updateItem(
                                  item.item_id,
                                  this.state.item_name,
                                  this.state.item_desc,
                                  this.state.item_price
                                );
                                this.setState({ editItem: false });
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
                                this.setState({ editItem: false });
                              }}
                            >
                              <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
                            </svg>
                          </div>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-pencil-fill pointer"
                            viewBox="0 0 16 16"
                            onClick={() => {
                              this.setState({ editItem: true });
                            }}
                          >
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                          </svg>
                        )}
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
