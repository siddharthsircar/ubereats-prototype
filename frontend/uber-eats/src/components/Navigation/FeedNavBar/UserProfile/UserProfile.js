import React, { Component } from "react";
import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl'

class UserProfile extends Component {
    render() {
        return (
            <div>
                <Form className="d-flex">
                    <Button variant="outline-success">Profile</Button>
                </Form>
            </div>
        );
    }
}

export default UserProfile;