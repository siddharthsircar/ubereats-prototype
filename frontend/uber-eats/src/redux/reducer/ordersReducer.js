/* eslint-disable no-fallthrough */
/* eslint-disable no-console */
import { GET_CART, EMPTY_CART } from "../actions/action_types";

const initState = {
  store_name: "",
  cart: [],
  total_items: 0,
  cart_total: 0,
  cart_summary: "",
};

const ordersReducer = (state = initState, action) => {
  switch (action.type) {
    case GET_CART: {
      let cart_total = 0;
      let total_items = 0;
      for (let i = 0; i < action.payload.cart.cart_summary.length; i++) {
        let [price, cur] =
          action.payload.cart.cart_summary[i].item_price.split(" ");
        cart_total += parseFloat(price);
        total_items += action.payload.cart.cart_summary[i].item_quantity;
      }
      cart_total = cart_total.toFixed(2);
      return {
        store_name: action.payload.cart.store_name,
        cart: action.payload.cart.cart_summary,
        total_items: total_items,
        cart_total: cart_total,
        cart_summary: action.payload.cart,
      };
    }

    case EMPTY_CART: {
      return {
        store_name: "",
        cart: [],
        total_items: 0,
        cart_total: 0,
        cart_summary: "",
      };
    }

    default:
      return state;
  }
};

export default ordersReducer;
