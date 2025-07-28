import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, User } from '@supabase/supabase-js';

// Initialize Supabase with environment variable validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ajzoulspsdzrjxffqvoi.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqem91bHNwc2R6cmp4ZmZxdm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMDYzMDMsImV4cCI6MjA2Nzg4MjMwM30.iHTW9lmLwlq3nWsz1NYeQJg-ZKYgrOaN6SBMHNyndLg";

console.log('[useAuth] Environment variables loaded:', {
    hasViteSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
    hasViteSupabaseAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    usingFallbackUrl: !import.meta.env.VITE_SUPABASE_URL,
    usingFallbackKey: !import.meta.env.VITE_SUPABASE_ANON_KEY,
    supabaseUrlLength: supabaseUrl?.length || 0,
    supabaseKeyLength: supabaseAnonKey?.length || 0
});

// Create a safe Supabase client that handles missing environment variables
let supabase: ReturnType<typeof createClient> | null = null;

console.log('[useAuth] Attempting to initialize Supabase client.......');

try {
    // Only create client if both URL and key are properly configured
    if (supabaseUrl && supabaseAnonKey &&
        typeof supabaseUrl === 'string' &&
        typeof supabaseAnonKey === 'string' &&
        supabaseUrl.length > 0 &&
        supabaseAnonKey.length > 0) {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log('[useAuth] Supabase client initialized successfully');
    } else {
        console.warn('[useAuth] Supabase client initialization skipped - invalid environment variables:', {
            urlValid: supabaseUrl && typeof supabaseUrl === 'string' && supabaseUrl.length > 0,
            keyValid: supabaseAnonKey && typeof supabaseAnonKey === 'string' && supabaseAnonKey.length > 0
        });
    }
} catch (error) {
    console.error('[useAuth] Failed to initialize Supabase client:', error);
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

    console.log('[useAuth] AuthProvider component mounting...');

    useEffect(() => {
        console.log('[useAuth] Setting up auth state listener...');

        if (!supabase) {
            console.warn('[useAuth] Skipping auth state listener setup - Supabase client not configured');
            return;
        }

        console.log('[useAuth] Supabase client available, setting up auth state change listener');

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            const timestamp = new Date().toISOString();
            console.log(`[useAuth] Auth state change at ${timestamp}:`, {
                event,
                hasSession: !!session,
                hasUser: !!session?.user,
                userId: session?.user?.id || null,
                userEmail: session?.user?.email || null,
                sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null
            });

            const newUser = session?.user ?? null;
            setUser(newUser);

            if (newUser) {
                console.log('[useAuth] User authenticated:', {
                    id: newUser.id,
                    email: newUser.email,
                    provider: newUser.app_metadata?.provider,
                    lastSignIn: newUser.last_sign_in_at
                });
            } else {
                console.log('[useAuth] User logged out or session ended');
            }
        });

        // Check for existing session on mount
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error('[useAuth] Error getting initial session:', error);
            } else {
                console.log('[useAuth] Initial session check:', {
                    hasSession: !!session,
                    hasUser: !!session?.user,
                    userId: session?.user?.id || null
                });
            }
        });

        return () => {
            console.log('[useAuth] Cleaning up auth state listener');
            authListener.subscription.unsubscribe();
        };
    }, []);

    const login = async () => {
        const startTime = Date.now();
        const redirectUrl = window.location.origin;

        console.log('[useAuth] Login attempt started:', {
            timestamp: new Date().toISOString(),
            redirectUrl,
            currentUrl: window.location.href,
            userAgent: navigator.userAgent.substring(0, 100) + '...'
        });

        if (!supabase) {
            console.warn('[useAuth] Login failed - Supabase not configured');
            return;
        }

        try {
            console.log('[useAuth] Initiating OAuth login with GitHub...');
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: redirectUrl,
                },
            });

            const duration = Date.now() - startTime;

            if (error) {
                console.error('[useAuth] OAuth login failed:', {
                    error: error.message,
                    duration: `${duration}ms`,
                    timestamp: new Date().toISOString()
                });
                throw error;
            }

            console.log('[useAuth] OAuth login initiated successfully:', {
                duration: `${duration}ms`,
                provider: 'github',
                redirectUrl
            });
        } catch (error) {
            const duration = Date.now() - startTime;
            console.error('[useAuth] Error during login:', {
                error: error instanceof Error ? error.message : String(error),
                duration: `${duration}ms`,
                timestamp: new Date().toISOString(),
                stack: error instanceof Error ? error.stack : undefined
            });
            // TODO: Implement user-friendly message display if needed (e.g., via toast or state)
        }
    };

    const logout = async () => {
        const startTime = Date.now();

        console.log('[useAuth] Logout attempt started:', {
            timestamp: new Date().toISOString(),
            currentUser: user ? {
                id: user.id,
                email: user.email
            } : null,
            currentUrl: window.location.href
        });

        if (!supabase) {
            console.warn('[useAuth] Logout failed - Supabase not configured');
            return;
        }

        try {
            console.log('[useAuth] Initiating logout...');
            const { error } = await supabase.auth.signOut();

            const duration = Date.now() - startTime;

            if (error) {
                console.error('[useAuth] Logout failed:', {
                    error: error.message,
                    duration: `${duration}ms`,
                    timestamp: new Date().toISOString()
                });
                throw error;
            }

            console.log('[useAuth] Logout completed successfully:', {
                duration: `${duration}ms`,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            const duration = Date.now() - startTime;
            console.error('[useAuth] Error during logout:', {
                error: error instanceof Error ? error.message : String(error),
                duration: `${duration}ms`,
                timestamp: new Date().toISOString(),
                stack: error instanceof Error ? error.stack : undefined
            });
            // TODO: Implement user-friendly message display if needed (e.g., via toast or state)
        }
    };

    useEffect(() => {
        return () => {
            console.log('[useAuth] AuthProvider component unmounting...');
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    console.log('[useAuth] useAuth hook called');
    const context = useContext(AuthContext);
    if (!context) {
        console.error('[useAuth] useAuth hook called outside of AuthProvider - this will throw an error');
        throw new Error('useAuth must be used within an AuthProvider');
    }
    console.log('[useAuth] useAuth hook returning context with user:', {
        hasUser: !!context.user,
        userId: context.user?.id || null
    });
    return context;
};

// Export the supabase client (may be null if not configured)
export { supabase };
