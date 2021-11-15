import axios from "axios";
import server from "../../config";
import {
  USER_LOGIN,
  USER_REGISTER,
  RESTAURANT_LOGIN,
  RESTAURANT_REGISTER,
  LOGOUT,
  UNAUTHENTICATED,
  UPDATE_USER,
} from "./action_types";

const userLoginDispatcher = (payload) => ({
  type: USER_LOGIN,
  payload,
});

const userRegisterDispatcher = (payload) => ({
  type: USER_REGISTER,
  payload,
});

const restLoginDispatcher = (payload) => ({
  type: RESTAURANT_LOGIN,
  payload,
});

const restRegisterDispatcher = (payload) => ({
  type: RESTAURANT_REGISTER,
  payload,
});

const logoutDispatcher = () => ({
  type: LOGOUT,
});

const unauthDispatcher = (payload) => ({
  type: UNAUTHENTICATED,
  payload,
});

const updateDispatcher = (payload) => ({
  type: UPDATE_USER,
  payload,
});

const loginUser = (payload) => (dispatch) => {
  axios
    .post(`${server}/login`, payload)
    .then((res) => {
      if (res.status === 200) {
        dispatch(userLoginDispatcher(res.data));
      }
    })
    .catch((errors) => {
      console.log(errors);
      if (errors.response.data) {
        console.log("in catch", errors.response.data.errors.message);
        dispatch(unauthDispatcher(errors.response.data.errors.message));
      } else {
        dispatch(unauthDispatcher("Server error"));
      }
    });
};

const registerUser = (payload) => (dispatch) => {
  console.log("User Payload :", payload);
  axios
    .post(`${server}/registerCustomer`, payload)
    .then((res) => {
      if (res.status === 201) {
        console.log(res);
        dispatch(userRegisterDispatcher(res.data));
      }
    })
    .catch((errors) => {
      if (errors.response.data) {
        console.log("in catch", errors.response.data);
        dispatch(unauthDispatcher(errors.response.data.errors.message));
      } else {
        dispatch(unauthDispatcher("Server error"));
      }
    });
};

const loginRest = (payload) => (dispatch) => {
  axios
    .post(`${server}/login`, payload)
    .then((res) => {
      if (res.status === 200) {
        dispatch(restLoginDispatcher(res.data));
      }
    })
    .catch((errors) => {
      console.log(errors);
      if (errors.response.data) {
        console.log("in catch", errors.response.data.errors.message);
        dispatch(unauthDispatcher(errors.response.data.errors.message));
      } else {
        dispatch(unauthDispatcher("Server error"));
      }
    });
};

const registerRest = (payload) => (dispatch) => {
  axios
    .post(`${server}/registerStore`, payload)
    .then((res) => {
      if (res.status === 201) {
        dispatch(restRegisterDispatcher(res.data));
      }
    })
    .catch((errors) => {
      if (errors.response.data) {
        console.log("in catch", errors.response.data);
        dispatch(unauthDispatcher(errors.response.data.errors.message));
      } else {
        dispatch(unauthDispatcher("Server error"));
      }
    });
};

export {
  userLoginDispatcher,
  logoutDispatcher,
  userRegisterDispatcher,
  restRegisterDispatcher,
  restLoginDispatcher,
  updateDispatcher,
  loginUser,
  registerUser,
  loginRest,
  registerRest,
};
