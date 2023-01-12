export const CLOSE_MESSAGE = 'CLOSE_MESSAGE';
export const SET_MESSAGE = 'SET_MESSAGE';
export const INIT = {
    message: null,
};

function reducer(state = INIT, { type, payload }) {
    switch (type) {
        case SET_MESSAGE:
            return { message: payload };
        case CLOSE_MESSAGE:
            return { message: null };
        default:
            return state;
    }
}

export default reducer;
