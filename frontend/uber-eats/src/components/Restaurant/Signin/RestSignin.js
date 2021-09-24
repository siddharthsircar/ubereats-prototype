import React, { Component } from "react";
import Logo from "../../Navigation/Logo/Logo";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../../../redux/actions/authAction';

class RestSignin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            authFlag: false
        }
        this.inputChange = this.inputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    inputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.loginUser(data);
    }

    render() {
        let signInError = null;
        if (this.props.authUser) {
            return <Redirect to="/restaurant/profile" />;
        }
        else if (!this.props.authUser) {
            signInError = this.props.signInError;
        }
        return (
            <div>
                <div className='fl-jc-center'>
                    <Logo />
                </div>
                <main className="pa4 black-80">
                    <form className="measure center" onSubmit={this.handleSubmit}>
                        <fieldset id="signin" className="ba b--transparent ph0 mh0">
                            <legend className="f3 fw6 ph0 mh0">Welcome Back</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" for="email-address">Email</label>
                                <input
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={this.state.email}
                                    onChange={this.inputChange} required autoFocus />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f5" for="password">Password</label>
                                <input
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={this.state.password}
                                    onChange={this.inputChange}
                                    required />
                            </div>
                            <div className="mv3 center b yellow">
                                {signInError}
                            </div>
                        </fieldset>

                        <div className="">
                            <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f5 dib" type="submit" value="Sign In" />
                        </div>
                        <div className="lh-copy mt3 f4">
                            New to Uber? <a href="/restaurant/register" className="b f4 link dim black db">Create an account</a>
                        </div>
                    </form>
                </main>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.auth.authUser,
    signInError: state.auth.error
});

const mapDispatchToProps = (dispatch) => ({
    loginUser: (payload) => dispatch(loginUser(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RestSignin);
