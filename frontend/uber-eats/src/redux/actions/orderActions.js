import axios from "axios";
import server from "../../config";
import { GET_CART, EMPTY_CART, DELIVERY_MODE } from "./action_types";

const getCartDispatcher = (payload) => ({
  type: GET_CART,
  payload,
});

const emptyCartDispatcher = () => ({
  type: EMPTY_CART,
});

const setDeliveryModeDispachter = (payload) => ({
  type: DELIVERY_MODE,
  payload,
});

const getUserCart = (payload) => (dispatch) => {
  try {
    axios
      .get(`${server}/user/cart/${payload}`)
      .then((res) => {
        if (res.status === 200) {
          console.log("Get Cart Result: ", res);
          if (!res.data.message) {
            dispatch(getCartDispatcher(res.data));
          } else dispatch(emptyCartDispatcher());
        }
      })
      .catch((errors) => {
        console.log("Error while fetching cart details: ", errors);
      });
  } catch (err) {
    console.log("Caught Error: ", err);
  }
};

export {
  getCartDispatcher,
  getUserCart,
  emptyCartDispatcher,
  setDeliveryModeDispachter,
};
