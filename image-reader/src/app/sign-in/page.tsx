"use client"

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

const SignInPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError('Sign in error: ' + result.error);
        } else {
            console.log('Sign in successful:', result);
            router.push('/');
        }
    };

    return (
        <Container maxWidth="sm" style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', marginTop: 10 }}>
            <Box mt={1}>
                <Typography variant="h4" component="h1" gutterBottom style={{ color: '#333' }}>
                    Sign In
                </Typography>
                {error && (
                    <Box mb={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}
                <form onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            variant="outlined"
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            variant="outlined"
                        />
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Sign In
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default SignInPage;