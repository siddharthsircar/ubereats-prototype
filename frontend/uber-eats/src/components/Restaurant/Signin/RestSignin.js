import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { loginRest } from "../../../redux/actions/authAction";
import { Link } from "react-router-dom";
import "./RestSignin.css";

class RestSignin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showError: false,
      signInError: "",
    };
    this.inputChange = this.inputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = () => {
    this.setState({
      showError: false,
    });
  };

  inputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, showError: false });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginRest(data);
    setTimeout(() => {
      if (!this.props.authUser) {
        this.setState({
          showError: true,
        });
      } else {
        this.setState({
          showError: false,
        });
      }
    }, 2000);
  };

  render() {
    let signInError = null;
    if (this.props.authUser || localStorage.getItem("user")) {
      return <Redirect to="/restaurant/profile" />;
    } else if (!this.props.authUser && this.state.showError) {
      signInError = this.props.signInError;
    }
    return (
      <div>
        <main className="pa4 black-80 w-50 center main">
          <form className="measure center" onSubmit={this.handleSubmit}>
            <fieldset id="signin" className="ba b--transparent ph0 mh0">
              <legend className="f3 fw6 ph0 mh0">
                <img
                  src="https://img.icons8.com/external-inipagistudio-mixed-inipagistudio/30/000000/external-restaurant-hospitality-inipagistudio-mixed-inipagistudio.png"
                  alt="restaurant-icon"
                />{" "}
                Welcome Back
              </legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent  w-100"
                  type="email"
                  name="email"
                  id="email"
                  value={this.state.email}
                  onChange={this.inputChange}
                  required
                  autoFocus
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f5" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent  w-100"
                  type="password"
                  name="password"
                  id="password"
                  value={this.state.password}
                  onChange={this.inputChange}
                  required
                />
              </div>
              <div className="mv3 center b red">{signInError}</div>
            </fieldset>

            <div className="">
              <button
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f5 dib"
                type="submit"
                value="Sign In"
              >
                Sign In
              </button>
            </div>
            <div className="lh-copy mt3 f4">
              New to Uber?
              <Link
                to="/restaurant/register"
                className="b f4 link dim hover-black black db"
                style={{ textDecoration: "none" }}
              >
                Create an account
              </Link>
            </div>
          </form>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  signInError: state.auth.error,
});

const mapDispatchToProps = (dispatch) => ({
  loginRest: (payload) => dispatch(loginRest(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RestSignin);
