import BlockChain from 'web3/Blockchain';
import { SET_CURRENT_USER } from '../reducers/user';

export const get = () => async (dispatch, getState) => {
    const { address, contracts } = BlockChain.getInfo();

    const balance = await contracts.token.balanceOf(address);

    return dispatch({
        payload: {
            balance: balance.formatUnits(),
        },
        type: SET_CURRENT_USER,
    });
};

export const set = (payload) => (dispatch, getState) => {
    const { user } = getState();

    return dispatch({
        payload,
        type: SET_CURRENT_USER,
    });
};
