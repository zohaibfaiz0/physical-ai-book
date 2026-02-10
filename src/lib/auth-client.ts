// Simple auth client for FastAPI backend on port 8000


import { BACKEND_URL } from './config';

const API_URL = BACKEND_URL;

interface User {
    id: string;
    email: string;
    name: string;
    profile?: UserProfile;
}

interface UserProfile {
    programming_experience?: string;
    known_languages?: string[];
    ai_ml_experience?: string;
    robotics_experience?: string;
    electronics_experience?: string;
    microcontroller_experience?: string[];
    sensor_actuator_experience?: boolean;
    preferred_learning_style?: string;
    learning_goal?: string;
}

interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

// Token storage
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

function setAuth(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// Auth functions
export async function signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Signup failed");
    }

    const data: AuthResponse = await response.json();
    setAuth(data.access_token, data.user);
    return data;
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
    }

    const data: AuthResponse = await response.json();
    setAuth(data.access_token, data.user);
    return data;
}

export function signOut() {
    clearAuth();
    window.location.reload();
}

export async function getMe(): Promise<User | null> {
    const token = getToken();
    if (!token) return null;

    try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            clearAuth();
            return null;
        }

        return await response.json();
    } catch {
        return null;
    }
}

export async function saveProfile(profile: UserProfile): Promise<boolean> {
    const token = getToken();
    if (!token) return false;

    const response = await fetch(`${API_URL}/api/user/profile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profile)
    });

    return response.ok;
}

export async function personalizeContent(chapterId: string, content: string): Promise<string> {
    const token = getToken();
    if (!token) return content;

    const response = await fetch(`${API_URL}/api/personalize/chapter`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ chapter_id: chapterId, content })
    });

    if (!response.ok) return content;

    const data = await response.json();
    return data.personalized ? data.content : content;
}
export { API_URL };
// React hook for auth state
export function useAuth() {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const checkAuth = async () => {
            const currentUser = await getMe();
            setUser(currentUser);
            setLoading(false);
        };
        checkAuth();
    }, []);

    return { user, loading, isAuthenticated: !!user };
}

import React from 'react';