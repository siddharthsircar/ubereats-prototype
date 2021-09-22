import {
    LOGIN, LOGOUT, REGISTER, UNAUTHENTICATED,
} from '../actions/action_types';

const initState = {
    authUser: false,
    error: '',
};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case LOGIN: {
            console.log('action payload', action.payload);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            return {
                authUser: true,
            };
        }
        case UNAUTHENTICATED: {
            console.log(action.payload);
            return {
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
                authUser: true,
            };
        }
        default:
            return state;
    }
};

export default authReducer;