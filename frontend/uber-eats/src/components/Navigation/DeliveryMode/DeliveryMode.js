import React, { useState } from "react";
import { ButtonGroup } from "react-bootstrap";
import ToggleButton from "react-bootstrap/ToggleButton";
import { connect } from "react-redux";
import { setDeliveryModeDispachter } from "../../../redux/actions/orderActions";

const DeliveryMode = (props) => {
  const [radioValue, setRadioValue] = useState(props.delivery_mode);
  props.setDeliveryMode(radioValue);
  return (
    <>
      <ButtonGroup>
        <ToggleButton
          key="delivery"
          id="delivery"
          type="radio"
          variant={radioValue === "delivery" ? "dark" : "outline"}
          name="radio"
          value="delivery"
          checked={radioValue === "delivery"}
          onChange={(e) => {
            setRadioValue(e.currentTarget.value);
            props.setDeliveryMode(e.currentTarget.value);
          }}
        >
          Delivery
        </ToggleButton>
        <ToggleButton
          key="pickup"
          id="pickup"
          type="radio"
          variant={radioValue === "pickup" ? "dark" : "outline"}
          name="radio"
          value="pickup"
          checked={radioValue === "pickup"}
          onChange={(e) => {
            setRadioValue(e.currentTarget.value);
            props.setDeliveryMode(e.currentTarget.value);
          }}
        >
          Pickup
        </ToggleButton>
      </ButtonGroup>
    </>
  );
};

const mapStateToProps = (state) => ({
  delivery_mode: state.delivery.delivery_mode,
});

const mapDispatchToProps = (dispatch) => ({
  setDeliveryMode: (payload) => dispatch(setDeliveryModeDispachter(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryMode);
