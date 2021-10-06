import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import 'bootstrap/dist/css/bootstrap.min.css';
import Address from './Address/Address';
import { logoutDispatcher } from '../../../redux/actions/authAction';
import './Profile.css';

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            user: '',
            activeTab: '1'
        };
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount = () => {
        if (localStorage.getItem('user')) {
            this.setState({ authFlag: this.props.authUser });
            console.log("Component Did Mount: ", this.state.authFlag);
            let user_id = JSON.parse(localStorage.getItem('user')).user_id;
            console.log(user_id);
            axios.get(`http://localhost:7000/user/profile/${user_id}`).then((res) => {
                this.setState(
                    {
                        user: res.data.user,
                        userId: res.data.user.userId
                    }
                );
            });
        } else {
            this.setState({ authFlag: false });
        }
    }

    handleLogout = () => {
        this.props.logoutDispatcher();
        this.setState({ authFlag: false });
    };

    render() {
        const toggle = tab => {
            if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
        }
        if (!this.props.authUser) {
            return <Redirect to="/home" />;
        }
        let address = null;
        if (this.state.user) {
            address = <Address userDets={this.state.user} />
        }
        return (
            <div className='parent-container'>
                <div className='center profile-container'>
                    <br />
                    <div className='user-info'>
                        <div>
                            <div className='full-name b f3 white ma2'>
                                {this.state.user.first_name + " " + this.state.user.last_name}
                            </div>
                            <div className='contact-details f5 white em'>
                                <span className="ma2">+1 {this.state.user.phone_number}</span>
                                <span className="ma2">{this.state.user.email}</span>
                            </div>
                        </div>
                        <br />
                        <div>
                            <Button className='white ma2'>Edit Profile</Button>
                        </div>
                    </div>
                    <br />
                    <div className='br3 shadow-5 bg-white'>
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={
                                        classnames(
                                            { active: this.state.activeTab === '1' },
                                            'b black hover-black pointer'
                                        )
                                    }
                                    onClick={() => { toggle('1'); }}
                                >
                                    <p className="black b">Address</p>
                                </NavLink>
                            </NavItem>
                            <NavItem className='black'>
                                <NavLink
                                    className={
                                        classnames(
                                            { active: this.state.activeTab === '2' },
                                            'b black hover-black pointer'
                                        )
                                    }
                                    onClick={() => { toggle('2'); }}
                                >
                                    <p className="black b">Orders</p>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={
                                        classnames(
                                            { active: this.state.activeTab === '3' },
                                            'b black hover-black pointer'
                                        )
                                    }
                                    onClick={() => { toggle('3'); }}
                                >
                                    <p className="black b">Favorites</p>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={
                                        classnames(
                                            'b black pointer'
                                        )
                                    }
                                    onClick={this.handleLogout}
                                >
                                    <p className="black b">Logout</p>
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Row>
                                    <Col sm="12">
                                        {/* <Address userDets={this.props.user} /> */}
                                        {address}
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row>
                                    <Col sm="6">
                                        <Card body>
                                            <CardTitle>Past Orders</CardTitle>
                                            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                        </Card>

                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="3">
                                <Row>
                                    <Col sm="6">
                                        <Card body>
                                            <CardTitle>Favorite Restaurants</CardTitle>
                                            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authUser: state.auth.authUser,
    userId: state.auth.userId
});

const mapDispatchToProps = (dispatch) => ({
    logoutDispatcher: () => dispatch(logoutDispatcher()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);