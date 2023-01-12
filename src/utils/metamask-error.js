import { error } from 'redux/actions/messages';
// import { messages } from "../constants/messages";

export const metamaskErrorWrap = (err, dispatch) => {
    let text = 'Something went wrong...';
    console.log(err);

    if (err.message) {
        text = err.message;
    }

    if (err.code && err.code === -32603) {
        if (err.message.indexOf('ds-math-sub-underflow') >= 0) {
            text =
                'You may be trying to spend more than your balance! Error code: 32603. Message: ds-math-sub-underflow';
        }

        if (err.data && err.data.message) {
            text = err.data.message.includes(':')
                ? err.data.message.split(':')[1].trim()
                : err.data.data || err.data.message;
        }

        if (err.data && err.data.message && err.data.message.includes('gas required exceeds allowance')) {
            text = 'Insufficient balance to make a transaction';
        }

        if (err.data && err.data.message && err.data.message.includes('insufficient funds for gas * price + value')) {
            text = 'Insufficient balance to make this transaction';
        }

        if (err.data && err.data.message && err.data.message.includes('transfer amount exceeds balance')) {
            text = 'Insufficient balance to make this transaction';
        }
    }

    if (err.code && err.code === 4001) {
        if (err.message.includes('User denied transaction signature')) {
            text = 'User denied transaction signature';
        }
    }

    return dispatch(error({ text, error: err }));
};
