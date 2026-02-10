import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import styles from './Auth.module.css';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
    const [view, setView] = useState<'login' | 'signup'>(initialView);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Create and manage a dedicated modal root
    useEffect(() => {
        let modalRoot = document.getElementById('modal-root');

        if (!modalRoot) {
            modalRoot = document.createElement('div');
            modalRoot.id = 'modal-root';
            modalRoot.style.position = 'fixed';
            modalRoot.style.top = '0';
            modalRoot.style.left = '0';
            modalRoot.style.width = '100%';
            modalRoot.style.height = '100%';
            modalRoot.style.zIndex = '10000'; // Higher than any other z-index
            document.body.appendChild(modalRoot);
        }

        // Store reference for cleanup
        const currentModalRoot = modalRoot;

        // Show/hide the modal root based on isOpen state
        currentModalRoot.style.display = isOpen ? 'block' : 'none';

        // Cleanup function
        return () => {
            // Only remove if it exists and we're truly done
            if (currentModalRoot && currentModalRoot.parentNode) {
                currentModalRoot.parentNode.removeChild(currentModalRoot);
            }
        };
    }, [isOpen]); // Include isOpen in dependency array to handle visibility

    // Handle body scroll locking when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            // Lock scroll when modal opens
            document.body.style.overflow = 'hidden';
        } else {
            // Unlock scroll when modal closes
            document.body.style.overflow = 'unset';
        }

        // Cleanup function to ensure scroll is unlocked when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const modalRoot = document.getElementById('modal-root');

    // If for some reason modalRoot doesn't exist, return null
    if (!modalRoot) return null;

    return createPortal(
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    ×
                </button>

                {view === 'login' ? (
                    <LoginForm
                        onSuccess={onClose}
                        onSwitchToSignup={() => setView('signup')}
                    />
                ) : (
                    <SignupForm
                        onSuccess={onClose}
                        onSwitchToLogin={() => setView('login')}
                    />
                )}
            </div>
        </div>,
        modalRoot
    );
}