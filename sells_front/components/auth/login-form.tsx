'use client';

import React, { useState } from 'react';
import { useLoginMutation } from '@/lib/features/authSliceApi';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser } from '@/lib/features/authSlice';
import { Card, CardHeader } from '@nextui-org/card';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, error }] = useLoginMutation();
    const dispatch = useDispatch();
    const router = useRouter();
    const [roleError, setRoleError] = useState<string | null>(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const user = await login({ username, password }).unwrap();
            if (user.client.role !== '1' && user.client.role !== '2') {
                setRoleError('Not authorized');
                return;
            }
            dispatch(setUser(user));
            if (user.client.role === '1') {
                router.push('/dashboard-seller');
            } else if (user.client.role === '2') {
                router.push('/dashboard');
            }
        } catch (err) {
            console.error('Failed to login:', err);
        }
    };

    return (
        <Card className="mt-2 w-full max-w-sm rounded-large bg-content1 px-8 py-6 shadow-small">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    {error && (
                        <p className="text-red-600">User does not exist</p>
                    )}
                    {roleError && (
                        <p className="text-red-600">{roleError}</p>
                    )}
                </CardHeader>
                <section className="flex flex-col gap-4">
                    <Input
                        label="Username"
                        value={username}
                        isRequired
                        required
                        color={error ? 'danger' : 'default'}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        label="Password"
                        value={password}
                        isRequired
                        required
                        type="password"
                        color={error ? 'danger' : 'default'}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" disabled={isLoading} isLoading={isLoading}>
                        {isLoading ? 'Loading...' : 'Log in'}
                    </Button>
                </section>
            </form>
        </Card>
    );
};

export default LoginForm;
