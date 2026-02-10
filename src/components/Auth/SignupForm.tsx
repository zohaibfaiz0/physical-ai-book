import React, { useState } from 'react';
import { signUp, saveProfile } from '../../lib/auth-client';
import styles from './Auth.module.css';

interface SignupFormProps {
    onSuccess: () => void;
    onSwitchToLogin: () => void;
}

const PROGRAMMING_LEVELS = ['none', 'beginner', 'intermediate', 'advanced', 'expert'];
const PROGRAMMING_LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'C++', 'C', 'Rust', 'Go', 'Java'];
const MICROCONTROLLERS = ['Arduino', 'Raspberry Pi', 'ESP32', 'STM32', 'NVIDIA Jetson'];
const LEARNING_STYLES = ['visual', 'reading', 'hands-on', 'video'];

export default function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1: Basic Info
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    // Step 2: Background
    const [programmingExperience, setProgrammingExperience] = useState('beginner');
    const [knownLanguages, setKnownLanguages] = useState<string[]>([]);
    const [aiMlExperience, setAiMlExperience] = useState('none');
    const [roboticsExperience, setRoboticsExperience] = useState('none');

    // Step 3: Hardware
    const [electronicsExperience, setElectronicsExperience] = useState('none');
    const [microcontrollerExperience, setMicrocontrollerExperience] = useState<string[]>([]);
    const [sensorActuatorExperience, setSensorActuatorExperience] = useState(false);

    // Step 4: Preferences
    const [preferredLearningStyle, setPreferredLearningStyle] = useState('hands-on');
    const [learningGoal, setLearningGoal] = useState('');

    const handleLanguageToggle = (lang: string) => {
        setKnownLanguages(prev =>
            prev.includes(lang)
                ? prev.filter(l => l !== lang)
                : [...prev, lang]
        );
    };

    const handleMicrocontrollerToggle = (mc: string) => {
        setMicrocontrollerExperience(prev =>
            prev.includes(mc)
                ? prev.filter(m => m !== mc)
                : [...prev, mc]
        );
    };

    const handleSignup = async () => {
        setLoading(true);
        setError('');

        try {
            // Step 1: Create account with FastAPI auth
            const result = await signUp(email, password, name);

            // Step 2: Save profile information
            const profileSaveSuccess = await saveProfile({
                programming_experience: programmingExperience,
                known_languages: knownLanguages,
                ai_ml_experience: aiMlExperience,
                robotics_experience: roboticsExperience,
                electronics_experience: electronicsExperience,
                microcontroller_experience: microcontrollerExperience,
                sensor_actuator_experience: sensorActuatorExperience,
                preferred_learning_style: preferredLearningStyle,
                learning_goal: learningGoal
            });

            if (!profileSaveSuccess) {
                console.warn('Profile save failed, but account created');
            }

            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <div className={styles.stepContent}>
            <h3>Create Your Account</h3>
            <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
            />
            <input
                type="password"
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
            />
            <button
                onClick={() => setStep(2)}
                disabled={!email || !password || !name || password.length < 8}
                className={styles.button}
            >
                Next: Software Background →
            </button>
        </div>
    );

    const renderStep2 = () => (
        <div className={styles.stepContent}>
            <h3>Software Background</h3>

            <label className={styles.label}>Programming Experience</label>
            <select
                value={programmingExperience}
                onChange={(e) => setProgrammingExperience(e.target.value)}
                className={styles.select}
            >
                {PROGRAMMING_LEVELS.map(level => (
                    <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                ))}
            </select>

            <label className={styles.label}>Programming Languages You Know</label>
            <div className={styles.chipContainer}>
                {PROGRAMMING_LANGUAGES.map(lang => (
                    <button
                        key={lang}
                        onClick={() => handleLanguageToggle(lang)}
                        className={`${styles.chip} ${knownLanguages.includes(lang) ? styles.chipActive : ''}`}
                    >
                        {lang}
                    </button>
                ))}
            </div>

            <label className={styles.label}>AI/ML Experience</label>
            <select
                value={aiMlExperience}
                onChange={(e) => setAiMlExperience(e.target.value)}
                className={styles.select}
            >
                {PROGRAMMING_LEVELS.map(level => (
                    <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                ))}
            </select>

            <label className={styles.label}>Robotics Experience</label>
            <select
                value={roboticsExperience}
                onChange={(e) => setRoboticsExperience(e.target.value)}
                className={styles.select}
            >
                {PROGRAMMING_LEVELS.map(level => (
                    <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                ))}
            </select>

            <div className={styles.buttonRow}>
                <button onClick={() => setStep(1)} className={styles.buttonSecondary}>
                    ← Back
                </button>
                <button onClick={() => setStep(3)} className={styles.button}>
                    Next: Hardware →
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className={styles.stepContent}>
            <h3>Hardware Background</h3>

            <label className={styles.label}>Electronics Experience</label>
            <select
                value={electronicsExperience}
                onChange={(e) => setElectronicsExperience(e.target.value)}
                className={styles.select}
            >
                {PROGRAMMING_LEVELS.map(level => (
                    <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                ))}
            </select>

            <label className={styles.label}>Microcontrollers/Platforms Used</label>
            <div className={styles.chipContainer}>
                {MICROCONTROLLERS.map(mc => (
                    <button
                        key={mc}
                        onClick={() => handleMicrocontrollerToggle(mc)}
                        className={`${styles.chip} ${microcontrollerExperience.includes(mc) ? styles.chipActive : ''}`}
                    >
                        {mc}
                    </button>
                ))}
            </div>

            <label className={styles.checkboxLabel}>
                <input
                    type="checkbox"
                    checked={sensorActuatorExperience}
                    onChange={(e) => setSensorActuatorExperience(e.target.checked)}
                />
                I have experience with sensors and actuators
            </label>

            <div className={styles.buttonRow}>
                <button onClick={() => setStep(2)} className={styles.buttonSecondary}>
                    ← Back
                </button>
                <button onClick={() => setStep(4)} className={styles.button}>
                    Next: Preferences →
                </button>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className={styles.stepContent}>
            <h3>Learning Preferences</h3>

            <label className={styles.label}>Preferred Learning Style</label>
            <select
                value={preferredLearningStyle}
                onChange={(e) => setPreferredLearningStyle(e.target.value)}
                className={styles.select}
            >
                {LEARNING_STYLES.map(style => (
                    <option key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                    </option>
                ))}
            </select>

            <label className={styles.label}>What's your main learning goal?</label>
            <textarea
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                placeholder="e.g., Build my own humanoid robot, Understand AI for robotics, Career transition..."
                className={styles.textarea}
                rows={3}
            />

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.buttonRow}>
                <button onClick={() => setStep(3)} className={styles.buttonSecondary}>
                    ← Back
                </button>
                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className={styles.buttonPrimary}
                >
                    {loading ? 'Creating Account...' : 'Complete Signup ✓'}
                </button>
            </div>
        </div>
    );

    return (
        <div className={styles.authContainer}>
            <div className={styles.progressBar}>
                {[1, 2, 3, 4].map(s => (
                    <div
                        key={s}
                        className={`${styles.progressStep} ${step >= s ? styles.progressActive : ''}`}
                    />
                ))}
            </div>

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            <p className={styles.switchAuth}>
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className={styles.linkButton}>
                    Sign In
                </button>
            </p>
        </div>
    );
}