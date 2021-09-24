import React, { Component } from "react";
import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl'

class UserCity extends Component {
    render() {
        return (
            <div>
                <Form className="d-flex">
                    <FormControl
                        type="label"
                        placeholder="City"
                        className="mr-2"
                        aria-label="Search"
                    />
                </Form>
            </div>
        );
    }
}

export default UserCity;