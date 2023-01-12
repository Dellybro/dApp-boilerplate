import { ethers } from 'ethers';
import TokenAbi from './abis/token.json';

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
        if (TokenAbi.Address[chain]) contracts.token = new ethers.Contract(TokenAbi.Address[chain], TokenAbi.ABI, provider);
        return contracts;
    }
}

export default BlockChain;
