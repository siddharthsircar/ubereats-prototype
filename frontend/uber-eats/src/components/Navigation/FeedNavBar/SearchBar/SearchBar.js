import React, { Component } from "react";
import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl'

class SearchBar extends Component {
    render() {
        return (
            <div>
                <Form className="d-flex">
                    <FormControl
                        type="search"
                        placeholder="Search"
                        className="mr-2"
                        aria-label="Search"
                    />
                    <Button variant="outline-success">Search</Button>
                </Form>
            </div>
        );
    }
}

export default SearchBar;