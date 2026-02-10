import React, { useState, useEffect } from 'react';
import { getMe, signOut } from '../lib/auth-client';
import AuthModal from './Auth/AuthModal';
import styles from './AuthBar.module.css';

export default function AuthBar() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getMe();
            setUser(currentUser);
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleSignOut = async () => {
        await signOut();
        setShowDropdown(false);
        // Optionally reload to update UI state
        window.location.reload();
    };

    if (loading) {
        return <div className={styles.authBar}>Loading...</div>;
    }

    return (
        <div className={styles.authBar}>
            {user ? (
                <div className={styles.userSection}>
                    <button
                        className={styles.userButton}
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <span className={styles.avatar}>
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                        <span className={styles.userName}>{user.name}</span>
                    </button>

                    {showDropdown && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownHeader}>
                                <strong>{user.name}</strong>
                                <span>{user.email}</span>
                            </div>
                            <hr />
                            <button
                                onClick={handleSignOut}
                                className={styles.dropdownItem}
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    className={styles.signInButton}
                    onClick={() => setShowModal(true)}
                >
                    Sign In / Sign Up
                </button>
            )}

            {showModal && (
                <AuthModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}