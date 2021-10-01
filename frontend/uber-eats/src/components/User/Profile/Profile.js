import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import 'bootstrap/dist/css/bootstrap.min.css';
import Address from './Address/Address';
import { logoutDispatcher } from '../../../redux/actions/authAction';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            user: '',
            authFlag: '',
            activeTab: '1'
        };
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount = () => {
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
    }

    handleLogout = () => {
        this.props.logoutDispatcher();
        this.setState({ authFlag: false });
    };

    render() {
        const toggle = tab => {
            if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
        }
        if (!this.state.authFlag) {
            <Redirect to="/home" />;
        }
        return (
            <div style={{ background: '#37718e', height: '92vh', position: 'relative', top: '8vh' }}>
                <div
                    className='center'
                    style={{
                        width: '50%',
                    }}
                >
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
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
                    <div className='br3 shadow-5' style={{ background: 'white' }} >
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
                                        <Address userDets={this.state.user} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);