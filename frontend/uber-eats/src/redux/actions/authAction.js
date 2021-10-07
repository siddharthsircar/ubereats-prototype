import axios from "axios";

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
  console.log("User Payload :", payload);
  axios
    .post("http://localhost:7000/user/login", payload)
    .then((res) => {
      if (res.status === 200) {
        console.log(res);
        dispatch(userLoginDispatcher(res.data));
      }
      console.log("dispatch response :", res);
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
    .post("http://localhost:7000/user/register", payload)
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
  console.log("Restaurant Payload :", payload);
  axios
    .post("http://localhost:7000/restaurant/login", payload)
    .then((res) => {
      if (res.status === 200) {
        console.log(res);
        dispatch(restLoginDispatcher(res.data));
      }
      console.log("dispatch response :", res);
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
  console.log("Restaurant Payload: ", payload);
  axios
    .post("http://localhost:7000/restaurant/register", payload)
    .then((res) => {
      if (res.status === 201) {
        console.log(res);
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
