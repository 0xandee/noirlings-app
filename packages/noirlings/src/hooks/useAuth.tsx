import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, User, SupabaseClient } from '@supabase/supabase-js';

// Validate and get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[useAuth] Missing Supabase environment variables. Authentication will be disabled.');
}

console.log('[useAuth] Environment variables status:', {
    hasSupabaseUrl: !!supabaseUrl,
    hasSupabaseAnonKey: !!supabaseAnonKey,
    urlLength: supabaseUrl?.length || 0,
    keyLength: supabaseAnonKey?.length || 0,
    isProduction: import.meta.env.PROD
});

// Create Supabase client with simple, reliable configuration
let supabase: SupabaseClient | null = null;
let clientInitializationAttempted = false;

function createSupabaseClient(): SupabaseClient | null {
    // Skip client creation if we don't have valid credentials
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('[useAuth] Cannot create Supabase client - missing credentials');
        return null;
    }
    
    // Skip client creation in server-side environments
    if (typeof window === 'undefined') {
        console.log('[useAuth] Server-side environment detected - skipping client creation');
        return null;
    }
    
    // Validate URL format
    try {
        new URL(supabaseUrl);
    } catch (error) {
        console.error('[useAuth] Invalid Supabase URL format:', supabaseUrl);
        return null;
    }
    
    // Validate anon key format (basic JWT check)
    const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    if (!jwtPattern.test(supabaseAnonKey)) {
        console.error('[useAuth] Invalid Supabase anon key format');
        return null;
    }
    
    try {
        console.log('[useAuth] Creating Supabase client...');
        
        // Ensure fetch is available with fallback
        const globalFetch = globalThis.fetch || fetch;
        
        const client = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
                flowType: 'pkce'
            },
            global: {
                fetch: globalFetch,
            }
        });
        
        console.log('[useAuth] Supabase client created successfully');
        return client;
        
    } catch (error) {
        console.error('[useAuth] Failed to create Supabase client:', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            environment: {
                hasWindow: typeof window !== 'undefined',
                hasHeaders: typeof Headers !== 'undefined',
                hasFetch: typeof fetch !== 'undefined',
                hasGlobalThis: typeof globalThis !== 'undefined',
                globalThisFetch: typeof globalThis.fetch !== 'undefined',
                isRailway: !!process.env.RAILWAY_ENVIRONMENT
            }
        });
        return null;
    }
}

// Lazy getter for Supabase client with single initialization attempt
function getSupabaseClient(): SupabaseClient | null {
    if (supabase) {
        return supabase;
    }
    
    if (clientInitializationAttempted) {
        return null;
    }
    
    clientInitializationAttempted = true;
    supabase = createSupabaseClient();
    return supabase;
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
        const client = getSupabaseClient();
        if (!client) {
            console.warn('[useAuth] Supabase client not available - authentication disabled');
            return;
        }

        console.log('[useAuth] Setting up auth state listener');

        const { data: authListener } = client.auth.onAuthStateChange((event, session) => {
            console.log(`[useAuth] Auth state change: ${event}`, {
                hasSession: !!session,
                hasUser: !!session?.user
            });

            setUser(session?.user ?? null);
        });

        // Check for existing session
        client.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error('[useAuth] Error getting initial session:', error);
            } else if (session) {
                console.log('[useAuth] Found existing session');
                setUser(session.user);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const login = async () => {
        const client = getSupabaseClient();
        if (!client) {
            console.warn('[useAuth] Cannot login - Supabase client not available');
            return;
        }

        try {
            console.log('[useAuth] Starting GitHub OAuth login');
            const { error } = await client.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: window.location.origin,
                },
            });

            if (error) {
                console.error('[useAuth] OAuth login failed:', error);
                throw error;
            }

            console.log('[useAuth] OAuth login initiated successfully');
        } catch (error) {
            console.error('[useAuth] Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        const client = getSupabaseClient();
        if (!client) {
            console.warn('[useAuth] Cannot logout - Supabase client not available');
            return;
        }

        try {
            console.log('[useAuth] Starting logout');
            const { error } = await client.auth.signOut();

            if (error) {
                console.error('[useAuth] Logout failed:', error);
                throw error;
            }

            console.log('[useAuth] Logout completed successfully');
        } catch (error) {
            console.error('[useAuth] Logout error:', error);
            throw error;
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

// Export the supabase client getter
export { getSupabaseClient as supabase };
