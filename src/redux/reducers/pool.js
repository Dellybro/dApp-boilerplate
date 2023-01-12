export const GET_POOL = 'GET_POOL';
export const POOL_ERROR = 'POOL_ERROR';
export const INIT = {};

function reducer(state = INIT, { type, payload }) {
    switch (type) {
        case GET_POOL:
            return payload;
        case POOL_ERROR:
            return state;
        default:
            return state;
    }
}

export default reducer;
