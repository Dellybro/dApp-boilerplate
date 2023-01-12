/** Basic react stuff */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';
import reportWebVitals from './reportWebVitals';
import 'utils/string-utils';
// Material UI & Redux
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/config';
import Router from './Router';
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeProvider } from '@mui/material/styles';
/** web3 */
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';

/** Theme */
import theme from './theme';
import WagmiListener from 'web3/WagmiListener';

const chains = [mainnet, polygon];
// Wagmi client
const { provider } = configureChains(chains, [walletConnectProvider({ projectId: process.env.REACT_APP_WALLET_CONNECT_PID })]);
const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({ appName: 'web3Modal', chains }),
    provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

const App = (props) => (
    <Provider store={store}>
        <PersistGate loading={<CircularProgress size={150} />} persistor={persistor}>
            <ThemeProvider theme={theme}>
                <WagmiConfig client={wagmiClient}>
                    <WagmiListener>
                        <Router />
                    </WagmiListener>
                </WagmiConfig>

                <Web3Modal projectId={process.env.REACT_APP_WALLET_CONNECT_PID} ethereumClient={ethereumClient} />
            </ThemeProvider>
        </PersistGate>
    </Provider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
