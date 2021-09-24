/* eslint-disable no-fallthrough */
/* eslint-disable no-console */
import {
    LOGIN, LOGOUT, REGISTER, UNAUTHENTICATED,
} from '../actions/action_types';

const initState = {
    user: '',
    authUser: false,
    error: '',
};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case LOGIN: {
            console.log('action payload', action.payload);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            return {
                user: action.payload.user,
                authUser: true,
            };
        }
        case UNAUTHENTICATED: {
            console.log(action.payload);
            return {
                error: action.payload,
                authUser: false,
            };
        }
        case LOGOUT: {
            console.log('logging out');
            localStorage.removeItem('user');
            return {
                authUser: false,
            };
        }
        case REGISTER: {
            console.log('inside register reducer', action.payload);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            return {
                user: action.payload.user,
                authUser: true,
            };
        }
        default:
            return state;
    }
};

export default authReducer;
