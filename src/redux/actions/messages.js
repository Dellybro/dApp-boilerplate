import { CLOSE_MESSAGE, SET_MESSAGE } from '../reducers/messages';

export const error = (payload) => {
    return {
        type: SET_MESSAGE,
        payload: {
            severity: 'error',
            ...payload,
        },
    };
};
export const success = (payload) => {
    return {
        type: SET_MESSAGE,
        payload: {
            severity: 'success',
            ...payload,
        },
    };
};
export const warning = (payload) => {
    return {
        type: SET_MESSAGE,
        payload: {
            severity: 'warning',
            ...payload,
        },
    };
};
export const info = (payload) => {
    return {
        type: SET_MESSAGE,
        payload: {
            severity: 'info',
            ...payload,
        },
    };
};

export const close = (payload) => {
    return {
        type: CLOSE_MESSAGE,
    };
};
