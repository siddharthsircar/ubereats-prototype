import React, { Component } from "react";
import Logo from "./Logo/Logo";
import SigninButton from "./SigninButton/SigninButton";
import Burger from "./Menu/MenuIcon/Burgermenu";
import SearchBar from "./FeedNavBar/SearchBar/SearchBar";
import UserCity from "./FeedNavBar/UserCity/UserCity";
import UserProfile from "./FeedNavBar/UserProfile/UserProfile";
import { connect } from "react-redux";
import "./Navigation.css";
import Cart from "./Cart/Cart";
import { getUserCart } from "../../redux/actions/orderActions";
import DeliveryMode from "./DeliveryMode/DeliveryMode";
class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: false,
    };
  }

  componentDidMount = () => {
    if (localStorage.getItem("userType") === "customer") {
      this.props.getUserCart(this.props.user.user_id);
    }
  };

  render() {
    let showMenu = null;
    let showSignin = null;
    let showSearch = null;
    let showLocation = null;
    let showProfile = null;
    let showCart = null;
    let showDeliveryMode = null;
    if (!this.props.authUser) {
      showMenu = <Burger open={this.props.open} setOpen={this.props.setOpen} />;
      showSignin = <SigninButton />;
    } else {
      if (localStorage.getItem("userType") === "customer") {
        showDeliveryMode = <DeliveryMode />;
        showSearch = <SearchBar />;
        showLocation = <UserCity />;
        showProfile = <UserProfile />;
        showCart = (
          <Cart
            summary={this.props.summary}
            openSummary={this.props.openSummary}
            closeSummary={this.props.closeSummary}
          />
        );
      }
    }
    return (
      <div>
        <div className="shadow-3 nav-container">
          <div className="logo">
            {showMenu}
            <Logo />
          </div>
          {showDeliveryMode}
          {showLocation}
          {showSearch}
          {showCart}
          {showProfile}
          {showSignin}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
  getUserCart: (payload) => dispatch(getUserCart(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
