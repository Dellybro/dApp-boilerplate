import { GET_BONDS, BONDS_ERROR } from '../reducers/bonds';
import { ethers } from 'ethers';
import countdown from 'utils/countdown';
import BlockChain from 'service/blockchain';

export const getBonds = () => async (dispatch, getState) => {
    const { address, contracts } = BlockChain.getInfo();
    if (!address || !contracts) throw new Error('Please connect your metamask');

    const userBonds = [];

    const _wethLpToken0 = await contracts.daiPair.token0();
    const _wethReserves = await contracts.daiPair.getReserves();

    let wethPrice = 0;
    if (_wethLpToken0 !== contracts.tokens.WETH) {
        wethPrice = parseFloat(ethers.utils.formatUnits(_wethReserves[0], 18)) / parseFloat(ethers.utils.formatUnits(_wethReserves[1], 18));
    } else {
        wethPrice = parseFloat(ethers.utils.formatUnits(_wethReserves[1], 18)) / parseFloat(ethers.utils.formatUnits(_wethReserves[0], 18));
    }

    const _lpTotalSupply = await contracts.lpPair.totalSupply();
    const _lpToken0 = await contracts.lpPair.token0();
    const _lpToken1 = await contracts.lpPair.token1();
    const _reserves = await contracts.lpPair.getReserves();

    let getPrice = 0;
    let pooledGET = 0;
    let pooledETH = 0;
    if (_lpToken0 !== contracts.tokens.GET) {
        pooledETH = ethers.utils.formatUnits(_reserves[0]);
        pooledGET = ethers.utils.formatUnits(_reserves[1]);
        getPrice = parseFloat(ethers.utils.formatUnits(_reserves[0], 18)) / parseFloat(ethers.utils.formatUnits(_reserves[1], 18));
    } else {
        pooledETH = ethers.utils.formatUnits(_reserves[1]);
        pooledGET = ethers.utils.formatUnits(_reserves[0]);
        getPrice = parseFloat(ethers.utils.formatUnits(_reserves[1], 18)) / parseFloat(ethers.utils.formatUnits(_reserves[0], 18));
    }
    getPrice *= wethPrice;

    const valuePerLp = (pooledETH * wethPrice + pooledGET * getPrice) / parseFloat(ethers.utils.formatUnits(_lpTotalSupply, 18));

    const _principleBalance = await contracts.lpPair.balanceOf(address);
    const _allowance = await contracts.lpPair.allowance(address, contracts.lpBond.options.address);
    const _userBondInfo = await contracts.lpBond.bondInfo(address);
    const _terms = await contracts.lpBond.terms();
    const _bondPrice = await contracts.lpBond.bondPrice();
    const _trueBondPrice = await contracts.lpBond.trueBondPrice();
    const _maxPayout = await contracts.lpBond.maxPayout();
    const _percentVested = await contracts.lpBond.percentVestedFor(address);
    const _pendingPayout = await contracts.lpBond.pendingPayoutFor(address);

    const bPrice = parseFloat(ethers.utils.formatUnits(_bondPrice, 7)) * valuePerLp;
    const tbPrice = parseFloat(ethers.utils.formatUnits(_trueBondPrice, 7)) * valuePerLp;

    const userBondInfo = {
        name: 'WETH-GET LP',
        tokenA: _lpToken0,
        tokenB: _lpToken1,
        payout: parseFloat(ethers.utils.formatUnits(_userBondInfo.payout, 18)),
        pendingPayout: parseFloat(ethers.utils.formatUnits(_pendingPayout)),
        vesting: parseInt(_userBondInfo.vesting),
        lastBlockTimestamp: parseInt(_userBondInfo.lastBlockTimestamp),
        truePricePaid: _userBondInfo.truePricePaid,
        percentVested: parseInt(_percentVested),
        address: contracts.lpBond.options.address,
    };
    userBondInfo.countdown = countdown(userBondInfo.lastBlockTimestamp + userBondInfo.vesting);

    if (userBondInfo.vesting > 0 && userBondInfo.payout > 0) {
        userBonds.push(userBondInfo);
    }

    const payload = {
        tokenPrice: getPrice,
        userBonds,
        rows: [
            {
                name: 'WETH-GET LP',
                link: 'https://sushi.com',
                tokenA: _lpToken0,
                tokenB: _lpToken1,
                allowance: parseFloat(ethers.utils.formatUnits(_allowance, 18)),
                principleBalance: ethers.utils.formatUnits(_principleBalance, 18),
                userBondInfo: userBondInfo,
                vestingTerm: parseInt(_terms.vestingTerm) / 86400,
                bondPrice: bPrice,
                discount: ((getPrice - tbPrice) / tbPrice) * 100,
                trueBondPrice: tbPrice,
                tokenPrice: getPrice,
                pairBondPrice: parseFloat(ethers.utils.formatUnits(_bondPrice, 7)),
                pairTrueBondPrice: parseFloat(ethers.utils.formatUnits(_trueBondPrice, 7)),
                maxPayout: ethers.utils.formatUnits(_maxPayout, 18),
                percentVested: _percentVested,
                pendingPayout: _pendingPayout,
                address: contracts.lpBond.options.address,
            },
        ],
    };

    dispatch({
        type: GET_BONDS,
        payload,
    });
};

export const deposit = (value, bond) => async (dispatch) => {
    const { address, contracts } = BlockChain.getInfo();
    if (!address || !contracts) throw new Error('Please connect your metamask');

    const calcPrem = bond.pairTrueBondPrice * (1 + 0.05);
    const maxPremium = ethers.utils.parseUnits(`${calcPrem.toFixed(7)}`, 7);
    const valueInWei = ethers.utils.parseUnits(value, 'ether');

    if (contracts.lpBond.options.address === bond.address) {
        await contracts.lpBond.deposit(valueInWei, maxPremium, address).send({ from: address });
    }

    await dispatch(getBonds());
};

export const redeem = (bond) => async (dispatch) => {
    const { address, contracts } = BlockChain.getInfo();
    if (!address || !contracts) throw new Error('Please connect your metamask');

    if (contracts.lpBond.options.address === bond.address) {
        await contracts.lpBond.redeem(address).send({ from: address });
    }

    await dispatch(getBonds());
};

export const updateBondAllowance = (bond) => async (dispatch, getState) => {
    const { address, contracts } = BlockChain.getInfo();
    if (!address || !contracts) throw new Error('Please connect your metamask');

    await contracts.lpPair.approve(bond.address, ethers.constants.MaxUint256).send({ from: address });

    await dispatch(getBonds());
};
