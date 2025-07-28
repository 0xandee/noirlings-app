import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, User } from '@supabase/supabase-js';

// Initialize Supabase with comprehensive validation and error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ajzoulspsdzrjxffqvoi.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqem91bHNwc2R6cmp4ZmZxdm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMDYzMDMsImV4cCI6MjA2Nzg4MjMwM30.iHTW9lmLwlq3nWsz1NYeQJg-ZKYgrOaN6SBMHNyndLg";

// Check browser API availability
function checkBrowserAPIs() {
    const apiChecks = {
        fetch: typeof fetch !== 'undefined',
        Headers: typeof Headers !== 'undefined',
        URL: typeof URL !== 'undefined',
        window: typeof window !== 'undefined',
        location: typeof window !== 'undefined' && typeof window.location !== 'undefined',
        localStorage: typeof localStorage !== 'undefined'
    };
    
    console.log('[useAuth] Browser API availability:', apiChecks);
    
    const missingApis = Object.entries(apiChecks)
        .filter(([, available]) => !available)
        .map(([api]) => api);
    
    if (missingApis.length > 0) {
        console.error('[useAuth] Missing required browser APIs:', missingApis);
        return false;
    }
    
    return true;
}

// Validate environment variables format
function validateEnvironmentVariables() {
    const validation = {
        urlValid: false,
        keyValid: false,
        urlFormat: null as string | null,
        keyFormat: null as string | null
    };
    
    // Validate URL format
    if (supabaseUrl && typeof supabaseUrl === 'string' && supabaseUrl.length > 0) {
        try {
            const url = new URL(supabaseUrl);
            validation.urlValid = url.protocol === 'https:' && url.hostname.includes('supabase');
            validation.urlFormat = `${url.protocol}//${url.hostname}`;
        } catch (error) {
            console.error('[useAuth] Invalid Supabase URL format:', error);
            validation.urlFormat = 'invalid';
        }
    }
    
    // Validate anon key format (should be a JWT)
    if (supabaseAnonKey && typeof supabaseAnonKey === 'string' && supabaseAnonKey.length > 0) {
        const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
        validation.keyValid = jwtPattern.test(supabaseAnonKey);
        validation.keyFormat = validation.keyValid ? 'valid-jwt' : 'invalid-jwt';
    }
    
    console.log('[useAuth] Environment variable validation:', validation);
    return validation;
}

console.log('[useAuth] Environment variables loaded:', {
    hasViteSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
    hasViteSupabaseAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    usingFallbackUrl: !import.meta.env.VITE_SUPABASE_URL,
    usingFallbackKey: !import.meta.env.VITE_SUPABASE_ANON_KEY,
    supabaseUrlLength: supabaseUrl?.length || 0,
    supabaseKeyLength: supabaseAnonKey?.length || 0,
    isServerSide: typeof window === 'undefined'
});

// Create a safe Supabase client with lazy initialization and retry logic
let supabase: ReturnType<typeof createClient> | null = null;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

function initializeSupabaseClient(retryCount = 0): ReturnType<typeof createClient> | null {
    const attemptNumber = retryCount + 1;
    console.log(`[useAuth] Attempting to initialize Supabase client (attempt ${attemptNumber}/${MAX_RETRY_ATTEMPTS})...`);
    
    // Check browser environment first
    if (typeof window === 'undefined') {
        console.warn('[useAuth] Running in server-side environment - deferring client creation');
        return null;
    }
    
    // Check browser API availability
    if (!checkBrowserAPIs()) {
        console.error('[useAuth] Required browser APIs not available - cannot create Supabase client');
        return null;
    }
    
    // Validate environment variables
    const validation = validateEnvironmentVariables();
    if (!validation.urlValid || !validation.keyValid) {
        console.error('[useAuth] Invalid environment variables - cannot create Supabase client');
        return null;
    }
    
    try {
        console.log('[useAuth] Creating Supabase client with configuration...');
        
        // Create client with explicit configuration for better browser compatibility
        const client = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            },
            global: {
                // Ensure we're using the browser's native fetch
                fetch: fetch.bind(globalThis)
            }
        });
        
        console.log('[useAuth] Supabase client initialized successfully');
        
        // Test client connectivity
        client.auth.getSession().then(() => {
            console.log('[useAuth] Supabase client connectivity test passed');
        }).catch((error) => {
            console.warn('[useAuth] Supabase client connectivity test failed:', error);
        });
        
        return client;
        
    } catch (error) {
        console.error(`[useAuth] Failed to initialize Supabase client (attempt ${attemptNumber}):`, {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            retryCount
        });
        
        // Retry logic
        if (retryCount < MAX_RETRY_ATTEMPTS - 1) {
            console.log(`[useAuth] Retrying Supabase client initialization in ${RETRY_DELAY}ms...`);
            setTimeout(() => {
                const retryClient = initializeSupabaseClient(retryCount + 1);
                if (retryClient) {
                    supabase = retryClient;
                    console.log('[useAuth] Supabase client retry successful');
                }
            }, RETRY_DELAY);
        } else {
            console.error('[useAuth] All Supabase client initialization attempts failed');
        }
        
        return null;
    }
}

// Lazy getter for Supabase client
function getSupabaseClient(): ReturnType<typeof createClient> | null {
    if (supabase) {
        return supabase;
    }
    
    // Attempt lazy initialization
    console.log('[useAuth] Lazy initializing Supabase client...');
    supabase = initializeSupabaseClient();
    return supabase;
}

// Initial attempt to create client (but don't fail if it doesn't work)
if (typeof window !== 'undefined') {
    supabase = initializeSupabaseClient();
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

        const client = getSupabaseClient();
        if (!client) {
            console.warn('[useAuth] Skipping auth state listener setup - Supabase client not configured');
            return;
        }

        console.log('[useAuth] Supabase client available, setting up auth state change listener');

        const { data: authListener } = client.auth.onAuthStateChange((event, session) => {
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
        client.auth.getSession().then(({ data: { session }, error }) => {
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

        const client = getSupabaseClient();
        if (!client) {
            console.warn('[useAuth] Login failed - Supabase not configured');
            return;
        }

        try {
            console.log('[useAuth] Initiating OAuth login with GitHub...');
            const { error } = await client.auth.signInWithOAuth({
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

        const client = getSupabaseClient();
        if (!client) {
            console.warn('[useAuth] Logout failed - Supabase not configured');
            return;
        }

        try {
            console.log('[useAuth] Initiating logout...');
            const { error } = await client.auth.signOut();

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

// Export the supabase client getter (may return null if not configured)
export { getSupabaseClient as supabase };
