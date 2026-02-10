import React, { useState } from 'react';
import { getToken, personalizeContent } from '../../lib/auth-client';
import styles from './PersonalizeButton.module.css';

interface PersonalizeButtonProps {
    chapterId: string;
    contentRef: React.RefObject<HTMLElement>;
}

export default function PersonalizeButton({ chapterId, contentRef }: PersonalizeButtonProps) {
    const token = getToken();
    const [isPersonalizing, setIsPersonalizing] = useState(false);
    const [isPersonalized, setIsPersonalized] = useState(false);
    const [error, setError] = useState('');

    const handlePersonalize = async () => {
        if (!token || !contentRef.current) return;

        setIsPersonalizing(true);
        setError('');

        try {
            const originalContent = contentRef.current.innerHTML;

            const personalizedContent = await personalizeContent(chapterId, originalContent);

            if (personalizedContent && contentRef.current) {
                // Store original content for potential reset
                contentRef.current.dataset.originalContent = originalContent;
                contentRef.current.innerHTML = personalizedContent;
                setIsPersonalized(true);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsPersonalizing(false);
        }
    };

    const handleReset = () => {
        if (contentRef.current && contentRef.current.dataset.originalContent) {
            contentRef.current.innerHTML = contentRef.current.dataset.originalContent;
            setIsPersonalized(false);
        }
    };

    if (!token) {
        return (
            <div className={styles.container}>
                <button className={styles.buttonDisabled} disabled>
                    🔒 Sign in to personalize content
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {!isPersonalized ? (
                <button
                    onClick={handlePersonalize}
                    disabled={isPersonalizing}
                    className={styles.button}
                >
                    {isPersonalizing ? (
                        <>
                            <span className={styles.spinner}></span>
                            Personalizing...
                        </>
                    ) : (
                        <>✨ Personalize for My Level</>
                    )}
                </button>
            ) : (
                <div className={styles.personalizedBadge}>
                    <span>✓ Content personalized for you</span>
                    <button onClick={handleReset} className={styles.resetButton}>
                        Reset
                    </button>
                </div>
            )}
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
}