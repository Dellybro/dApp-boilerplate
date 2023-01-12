import React, { useContext, useEffect } from 'react';
// Modules
import { ContractContext } from 'web3/WagmiListener';
import { useWeb3Modal } from '@web3modal/react';
import { useDispatch, useSelector } from 'react-redux';
// UI
import { Box, Button } from '@mui/material';
// Styles
import useStyles from './styles';
import { getPool } from 'redux/actions/pool';

export default function Home() {
    const classes = useStyles();
    const { open } = useWeb3Modal();
    const { initialized } = useContext(ContractContext);

    const dispatch = useDispatch();
    const { pool } = useSelector(({ pool }) => ({ pool }));

    useEffect(() => {
        if (initialized) handleGetUser();
    }, [initialized]);

    async function handleGetUser() {
        dispatch(getPool());
    }

    console.log(pool);

    return (
        <Box className={classes.root}>
            <Button onClick={open}>Connect To Web3</Button>
        </Box>
    );
}
