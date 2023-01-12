import { GET_POOL, POOL_ERROR } from '../reducers/pool';
import { ethers } from 'ethers';
import { metamaskErrorWrap } from 'utils/metamask-error';
import dayjs from 'dayjs';

import BlockChain from 'service/blockchain';

export const getPool = () => async (dispatch) => {
    const { address, contracts } = BlockChain.getInfo();
    if (!address || !contracts) throw new Error('Please connect your metamask');

    const _balance = await contracts.token.balanceOf(address);
    const _allowance = await contracts.token.allowance(address, contracts.pool.options.address);
    const _bonusBalance = await contracts.bonusToken.balanceOf(address);
    const _poolInfo = await contracts.pool.getPoolInfo();
    const _userPoolInfo = await contracts.pool.userInfo(address);
    const _pendingPoolRewards = await contracts.pool.getPendingReward(address);

    const allowance = parseFloat(ethers.utils.formatUnits(_allowance, 9));
    const balance = parseFloat(ethers.utils.formatUnits(_balance, 9));
    const bonusBalance = parseFloat(ethers.utils.formatUnits(_bonusBalance, 9));
    const poolInfo = {
        pooledTokens: parseFloat(ethers.utils.formatUnits(_poolInfo.pooledTokens, 9)),
        totalShares: parseFloat(ethers.utils.formatUnits(_poolInfo.totalShares, 9)),
        currentApr: parseFloat(ethers.utils.formatUnits(_poolInfo.currentApr, 2)),
        aprSlowdown: parseFloat(ethers.utils.formatUnits(_poolInfo.aprSlowdown, 2)),
        minApr: parseFloat(ethers.utils.formatUnits(_poolInfo.minApr, 2)),
        secondsBetweenRewards: parseFloat(_poolInfo.secondsBetweenRewards),
        nextInterestTime: parseFloat(_poolInfo.nextInterestTime),
        minimumDepositTime: parseFloat(_poolInfo.minimumDepositTime),
        secondsInDay: parseFloat(_poolInfo.secondsInDay),
        earlyPenalty: parseFloat(ethers.utils.formatUnits(_poolInfo.earlyPenalty, 2)),
    };
    const userPoolInfo = {
        principle: parseFloat(ethers.utils.formatUnits(_userPoolInfo.principle, 9)),
        shares: parseFloat(ethers.utils.formatUnits(_userPoolInfo.shares, 9)),
        lastActionTime: parseInt(_userPoolInfo.lastActionTime),
    };
    const pendingPoolRewards = parseFloat(ethers.utils.formatUnits(_pendingPoolRewards, 9));

    userPoolInfo.penalizedUntil = poolInfo.minimumDepositTime + userPoolInfo.lastActionTime;
    if (parseInt(new Date().getTime() / 1000) > userPoolInfo.penalizedUntil) {
        userPoolInfo.penalizedUntil = null;
    } else {
        const date = new Date(userPoolInfo.penalizedUntil) * 1000;
        userPoolInfo.penalizedUntil = `${dayjs(date).format('MMM DD')} at ${dayjs(date).format('h:mm a')}`;
    }

    const fiveDayROI =
        ((userPoolInfo.principle + pendingPoolRewards) * poolInfo.currentApr) / 100 + userPoolInfo.principle + pendingPoolRewards;
    const fiveDayAPY = poolInfo.currentApr * (5 / 365);

    const nextPayout = (poolInfo.currentApr / 365 / 3 / 100) * (userPoolInfo.principle + pendingPoolRewards);
    poolInfo.currentApy = (Math.pow(poolInfo.currentApr / 100 / 365 + 1, 365) - 1) * 100;

    const payload = {
        nextPayout,
        balance,
        bonusBalance,
        poolInfo,
        pendingPoolRewards,
        userPoolInfo,
        allowance,
        fiveDayROI,
        fiveDayAPY,
    };

    dispatch({
        type: GET_POOL,
        payload,
    });

    return payload;
};

export const updateAllowance = () => async (dispatch, getState) => {
    const { address, contracts } = BlockChain.getInfo();
    if (!address || !contracts) throw new Error('Please connect your metamask');

    try {
        await contracts.token.approve(contracts.pool.options.address, ethers.constants.MaxUint256).send({ from: address });

        await dispatch(getPool());
    } catch (error) {
        metamaskErrorWrap(error, dispatch);
        throw error;
    }
};

export const deposit = (amount) => async (dispatch) => {
    const { address, contracts } = BlockChain.getInfo();
    if (!address || !contracts) throw new Error('Please connect your metamask');

    await contracts.pool.deposit(ethers.utils.parseUnits(amount, 'gwei')).send({ from: address });
    await dispatch(getPool());
};

export const withdraw = (amount) => async (dispatch) => {
    const { address, contracts } = BlockChain.getInfo();
    if (!address || !contracts) throw new Error('Please connect your metamask');

    await contracts.pool.withdrawPrinciple(ethers.utils.parseUnits(amount, 'gwei')).send({ from: address });
    await dispatch(getPool());
};

export const withdrawRewards = () => async (dispatch) => {
    const { address, contracts } = BlockChain.getInfo();
    if (!address || !contracts) throw new Error('Please connect your metamask');

    await contracts.pool.withdrawRewards().send({ from: address });
    await dispatch(getPool());
};

export const withdrawAll = () => async (dispatch) => {
    const { address, contracts } = BlockChain.getInfo();
    if (!address || !contracts) throw new Error('Please connect your metamask');

    await contracts.pool.withdrawAll().send({ from: address });
    await dispatch(getPool());
};
