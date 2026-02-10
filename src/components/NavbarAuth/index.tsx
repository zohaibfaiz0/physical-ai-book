import React, { useState, useEffect } from 'react';
import { getMe, signOut } from '../../lib/auth-client';
import AuthModal from '../Auth/AuthModal';
import styles from './NavbarAuth.module.css';

export default function NavbarAuth() {
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

    if (loading) {
        return <div className={styles.skeleton}></div>;
    }

    if (user) {
        return (
            <div className={styles.userMenu}>
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
                            onClick={() => {
                                signOut();
                                setShowDropdown(false);
                            }}
                            className={styles.dropdownItem}
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <button
                className={styles.signInButton}
                onClick={() => setShowModal(true)}
            >
                Sign In
            </button>
            {showModal && (
                <AuthModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}