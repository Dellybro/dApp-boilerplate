import React, { createContext, useEffect, useRef, useState } from 'react';
import { useWeb3ModalNetwork } from '@web3modal/react';
import { useAccount, useProvider } from 'wagmi';
import BlockChain from './Blockchain';

export const ContractContext = createContext();

const WagmiListener = (props) => {
    const { address, isConnected } = useAccount();
    const provider = useProvider();
    const { selectedChain } = useWeb3ModalNetwork();
    const initializing = useRef();
    const [initialized, setInitialized] = useState(null);

    useEffect(() => {
        if (isConnected && selectedChain) {
            initialize();
        }
    }, [isConnected, selectedChain, address]);

    function initialize() {
        /** isConnected and selectedChain will fire multiple times */
        if (initializing.current) return;
        if (initialized === selectedChain.name) return;

        initializing.current = true;
        BlockChain.initialize({ address, provider, chain: selectedChain.name });
        setInitialized(`${selectedChain.name}-${address}`); // this account for chain change and address change
        initializing.current = false;
    }

    const values = { initialized };
    return <ContractContext.Provider value={values}>{props.children}</ContractContext.Provider>;
};

export default WagmiListener;
