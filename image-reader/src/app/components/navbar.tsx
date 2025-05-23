"use client"
import Link from 'next/link';
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Navbar: React.FC = () => {
    const { data: session } = useSession();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link href="/" passHref>
                        <Button color="inherit">Home</Button>
                    </Link>
                    <Link href="/saved-texts" passHref>
                        <Button color="inherit">Saved Text</Button>
                    </Link>
                    <Link href="/receipt-reader" passHref>
                        <Button color="inherit">Receipt</Button>
                    </Link>
                    <Link href="/saved-receipts" passHref>
                        <Button color="inherit">Saved Receipts</Button>
                    </Link>
                </Typography>
                {session ? (
                    <Button color="inherit" onClick={() => signOut()}>Logout</Button>
                ) : (
                    <Box>
                        <Link href="/sign-in" passHref>
                            <Button color="inherit">Login</Button>
                        </Link>
                        <Link href="/registration" passHref>
                            <Button color="inherit">Register</Button>
                        </Link>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;