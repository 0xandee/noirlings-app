import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, User } from '@supabase/supabase-js';

// Initialize Supabase with environment variable validation
const supabaseUrl = "https://ajzoulspsdzrjxffqvoi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqem91bHNwc2R6cmp4ZmZxdm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMDYzMDMsImV4cCI6MjA2Nzg4MjMwM30.iHTW9lmLwlq3nWsz1NYeQJg-ZKYgrOaN6SBMHNyndLg";

// Create a safe Supabase client that handles missing environment variables
let supabase: ReturnType<typeof createClient> | null = null;

try {
    // Only create client if both URL and key are properly configured
    if (supabaseUrl && supabaseAnonKey &&
        typeof supabaseUrl === 'string' &&
        typeof supabaseAnonKey === 'string' &&
        supabaseUrl.length > 0 &&
        supabaseAnonKey.length > 0) {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
} catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
    supabase = null;
}

interface AuthContextType {
    user: User | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!supabase) return; // Skip if Supabase is not configured

        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => { // Remove unused event
            setUser(session?.user ?? null);
        });
        return () => authListener.subscription.unsubscribe();
    }, []);

    const login = async () => {
        if (!supabase) {
            console.warn('Supabase not configured - login unavailable');
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error during login:', error);
            // TODO: Implement user-friendly message display if needed (e.g., via toast or state)
        }
    };

    const logout = async () => {
        if (!supabase) {
            console.warn('Supabase not configured - logout unavailable');
            return;
        }

        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Error during logout:', error);
            // TODO: Implement user-friendly message display if needed (e.g., via toast or state)
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Export the supabase client (may be null if not configured)
export { supabase };
