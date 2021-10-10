/* eslint-disable no-fallthrough */
/* eslint-disable no-console */
import {
  USER_LOGIN,
  USER_REGISTER,
  RESTAURANT_LOGIN,
  RESTAURANT_REGISTER,
  LOGOUT,
  UNAUTHENTICATED,
  UPDATE_USER,
} from "../actions/action_types";

const initState = {
  user: "",
  userId: "",
  authUser: false,
  error: "",
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case USER_LOGIN: {
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("userType", "customer");
      return {
        user: action.payload.user,
        userId: action.payload.user.user_id,
        authUser: true,
      };
    }
    case USER_REGISTER: {
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("userType", "customer");
      return {
        user: action.payload.user,
        userId: action.payload.user.user_id,
        authUser: true,
      };
    }
    case RESTAURANT_LOGIN: {
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("userType", "restaurant");
      return {
        user: action.payload.user,
        userId: action.payload.user.rest_id,
        authUser: true,
      };
    }
    case RESTAURANT_REGISTER: {
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("userType", "restaurant");
      return {
        user: action.payload.user,
        userId: action.payload.user.rest_id,
        authUser: true,
      };
    }
    case UNAUTHENTICATED: {
      return {
        error: action.payload,
        authUser: false,
      };
    }
    case UPDATE_USER: {
      return {
        user: action.payload,
        userId: action.payload.rest_id,
        authUser: true,
      };
    }
    case LOGOUT: {
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      return {
        authUser: false,
      };
    }
    default:
      return state;
  }
};

export default authReducer;
