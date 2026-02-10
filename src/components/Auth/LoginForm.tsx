import React, { useState } from 'react';
import { signIn } from '../../lib/auth-client';
import styles from './Auth.module.css';

interface LoginFormProps {
    onSuccess: () => void;
    onSwitchToSignup: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn(email, password);
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <h2>Welcome Back</h2>
            <p className={styles.subtitle}>Sign in to access personalized content</p>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    required
                />

                {error && <div className={styles.error}>{error}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className={styles.buttonPrimary}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p className={styles.switchAuth}>
                Don't have an account?{' '}
                <button onClick={onSwitchToSignup} className={styles.linkButton}>
                    Sign Up
                </button>
            </p>
        </div>
    );
}