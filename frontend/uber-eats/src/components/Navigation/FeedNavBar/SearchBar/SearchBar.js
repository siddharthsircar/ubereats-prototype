import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { Link } from "react-router-dom";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: "",
    };
  }

  render() {
    let searchButton = null;
    if (this.state.q) {
      searchButton = (
        <Link
          to={{ pathname: "/search", state: { searchQuery: this.state.q } }}
        >
          <Button
            variant="dark"
            onClick={() => {
              this.setState({ q: "" });
            }}
          >
            Search
          </Button>
        </Link>
      );
    } else searchButton = <Button variant="dark">Search</Button>;
    return (
      <div className="br4 w-30">
        <Form className="d-flex" onSubmit="/search">
          <FormControl
            type="search"
            placeholder="Search"
            className="mr-2"
            aria-label="Search"
            value={this.state.q}
            onChange={(e) => {
              this.setState({ q: e.target.value });
            }}
          />
          <div style={{ width: "20px" }}>{searchButton}</div>
        </Form>
      </div>
    );
  }
}

export default SearchBar;
