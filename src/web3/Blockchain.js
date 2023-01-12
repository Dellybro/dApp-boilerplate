import { ethers } from 'ethers';
/** Deployed Contracts */
import TokenAbi from './abis/token.json';
import BondAbi from './abis/Bond.json';
import BonusTokenAbi from './abis/BonusToken.json';
import PoolAbi from './abis/Pool.json';
import UniswapPairAbi from './abis/UniswapPair.json';
/** Generic Contracts */
// import ERC20Abi from './abis/ERC20.json';
// import UniswapERC20Abi from './abis/UniswapERC20.json';

class BlockChain {
    static initialize({ address, chain, provider }) {
        BlockChain.provider = provider;
        BlockChain.contracts = BlockChain.loadContracts(chain, provider);
        BlockChain.address = address;
    }

    static getInfo() {
        return { contracts: BlockChain.contracts, address: BlockChain.address };
    }

    static loadContracts(chain, provider) {
        const contracts = {};
        // token
        if (TokenAbi.Address[chain]) contracts.token = new ethers.Contract(TokenAbi.Address[chain], TokenAbi.ABI, provider);
        // Bonus Token
        if (BonusTokenAbi.Address[chain])
            contracts.bonusToken = new ethers.Contract(BonusTokenAbi.Address[chain], BonusTokenAbi.ABI, provider);
        // Pool
        if (PoolAbi.Address[chain]) contracts.pool = new ethers.Contract(PoolAbi.Address[chain], PoolAbi.ABI, provider);
        // LP Bond
        if (BondAbi.Address[chain]?.LP) contracts.lpBond = new ethers.Contract(BondAbi.Address[chain].LP, BondAbi.ABI, provider);

        // get token LP Pair
        if (UniswapPairAbi.Address[chain]?.GET_LP)
            contracts.lpPair = new ethers.Contract(UniswapPairAbi.Address[chain]?.GET_LP, UniswapPairAbi.ABI, provider);
        // WETH_DAI pair
        if (UniswapPairAbi.Address[chain]?.WETH_DAI)
            contracts.daiPair = new ethers.Contract(UniswapPairAbi.Address[chain]?.WETH_DAI, UniswapPairAbi.ABI, provider);

        return contracts;
    }
}

export default BlockChain;
