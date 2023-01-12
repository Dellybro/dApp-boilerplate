export const GET_BONDS = 'GET_BONDS';
export const BONDS_ERROR = 'BONDS_ERROR';
export const INIT = {};

function reducer(state = INIT, { type, payload }) {
    switch (type) {
        case GET_BONDS:
            return payload;
        case BONDS_ERROR:
            return state;
        default:
            return state;
    }
}

export default reducer;
