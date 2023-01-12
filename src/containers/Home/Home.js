import React, { useContext, useEffect } from 'react';
// Modules
import { ContractContext } from 'web3/WagmiListener';
import { useWeb3Modal } from '@web3modal/react';
import { useDispatch, useSelector } from 'react-redux';
// UI
import { Box, Button } from '@mui/material';
// Styles
import useStyles from './styles';
import { get as getUser } from 'redux/actions/user';

export default function Home() {
    const classes = useStyles();
    const { open } = useWeb3Modal();
    const { initialized } = useContext(ContractContext);

    const dispatch = useDispatch();
    const { user } = useSelector(({ user }) => ({ user }));

    useEffect(() => {
        if (initialized) handleGetUser();
    }, [initialized]);

    async function handleGetUser() {
        dispatch(getUser());
    }

    return (
        <Box className={classes.root}>
            <Button onClick={open}>Connect To Web3</Button>
        </Box>
    );
}
