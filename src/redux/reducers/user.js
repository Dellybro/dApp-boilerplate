export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const LOGOUT = 'LOGOUT';
export const USER_ERROR = 'USER_ERROR';
export const INIT = null;

function reducer(state = INIT, { type, payload }) {
    switch (type) {
        case SET_CURRENT_USER:
            return payload;
        case LOGOUT:
            return INIT;
        case USER_ERROR:
        default:
            return state;
    }
}

export default reducer;
