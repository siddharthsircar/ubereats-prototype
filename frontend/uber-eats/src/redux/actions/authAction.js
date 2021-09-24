import axios from 'axios';

import {
    LOGIN, LOGOUT, REGISTER, UNAUTHENTICATED,
} from './action_types';

const loginDispatcher = (payload) => ({
    type: LOGIN, payload,
});

const logoutDispatcher = () => ({
    type: LOGOUT,
});

const registerDispatcher = (payload) => ({
    type: REGISTER, payload,
});

const unauthDispatcher = (payload) => ({
    type: UNAUTHENTICATED, payload,
});

const loginUser = (payload) => (dispatch) => {
    console.log('PL :', payload);
    axios.post('http://localhost:7000/user/login', payload)
        .then((res) => {
            if (res.status === 200) {
                console.log(res);
                dispatch(loginDispatcher(res.data));
            }
            console.log('dispatch response :', res);
        })
        .catch((errors) => {
            console.log(errors);
            if (errors.response.data) {
                console.log('in catch', errors.response.data);
                dispatch(unauthDispatcher(errors.response.data.errors.body));
            } else {
                dispatch(unauthDispatcher('Server error'));
            }
        });
};

const registerUser = (payload) => (dispatch) => {
    console.log(payload);
    axios.post('http://localhost:7000/user/register', payload)
        .then((res) => {
            if (res.status === 201) {
                console.log(res);
                dispatch(registerDispatcher(res.data));
            }
        })
        .catch((errors) => {
            if (errors.response.data) {
                console.log('in catch', errors.response.data);
                dispatch(unauthDispatcher(errors.response.data.errors.body));
            } else {
                dispatch(unauthDispatcher('Server error'));
            }
        });
};

export {
    loginDispatcher, logoutDispatcher, registerDispatcher, loginUser, registerUser,
};