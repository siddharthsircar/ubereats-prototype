/* eslint-disable no-fallthrough */
/* eslint-disable no-console */
import { DELIVERY_MODE } from "../actions/action_types";

const initState = {
  delivery_mode: "delivery",
};

const deliveryReducer = (state = initState, action) => {
  switch (action.type) {
    case DELIVERY_MODE: {
      return {
        delivery_mode: action.payload,
      };
    }

    default:
      return state;
  }
};

export default deliveryReducer;
