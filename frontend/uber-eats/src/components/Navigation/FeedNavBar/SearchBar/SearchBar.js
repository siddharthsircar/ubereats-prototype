import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

class SearchBar extends Component {
  render() {
    return (
      <div className="br4 w-30">
        <Form className="d-flex">
          <FormControl
            type="search"
            placeholder="Search"
            className="mr-2"
            aria-label="Search"
          />
          <div style={{ width: "20px" }}></div>
          <Button variant="dark">Search</Button>
        </Form>
      </div>
    );
  }
}

export default SearchBar;
