import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, User } from '@supabase/supabase-js';

// Initialize Supabase with comprehensive validation and error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ajzoulspsdzrjxffqvoi.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqem91bHNwc2R6cmp4ZmZxdm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMDYzMDMsImV4cCI6MjA2Nzg4MjMwM30.iHTW9lmLwlq3nWsz1NYeQJg-ZKYgrOaN6SBMHNyndLg";

// Custom fetch wrapper with enhanced error handling and required properties
function createEnhancedFetch() {
    console.log('[useAuth] Creating enhanced fetch wrapper...');
    
    if (typeof fetch === 'undefined') {
        console.error('[useAuth] Native fetch is not available');
        return null;
    }
    
    return async (input: RequestInfo | URL, init?: RequestInit) => {
        console.log('[useAuth] Enhanced fetch called:', { 
            url: typeof input === 'string' ? input : input.toString(),
            method: init?.method || 'GET',
            hasHeaders: !!init?.headers
        });
        
        try {
            // Ensure headers object exists and has required properties
            const enhancedInit = {
                ...init,
                headers: new Headers(init?.headers || {}),
            };
            
            // Ensure the headers object has all required methods
            if (!enhancedInit.headers.get) {
                console.error('[useAuth] Headers object missing required methods');
                enhancedInit.headers = new Headers(init?.headers || {});
            }
            
            const response = await fetch(input, enhancedInit);
            
            console.log('[useAuth] Enhanced fetch response:', {
                status: response.status,
                ok: response.ok,
                url: response.url
            });
            
            return response;
        } catch (error) {
            console.error('[useAuth] Enhanced fetch error:', {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    };
}

// Polyfill missing global objects that Supabase client expects
function polyfillGlobals() {
    console.log('[useAuth] Polyfilling globals for Supabase compatibility...');
    
    // Ensure globalThis has all required properties
    if (typeof globalThis !== 'undefined') {
        // Ensure Headers constructor is available
        if (typeof globalThis.Headers === 'undefined' && typeof Headers !== 'undefined') {
            globalThis.Headers = Headers;
        }
        
        // Ensure Request constructor is available
        if (typeof globalThis.Request === 'undefined' && typeof Request !== 'undefined') {
            globalThis.Request = Request;
        }
        
        // Ensure Response constructor is available
        if (typeof globalThis.Response === 'undefined' && typeof Response !== 'undefined') {
            globalThis.Response = Response;
        }
        
        // Ensure URL constructor is available
        if (typeof globalThis.URL === 'undefined' && typeof URL !== 'undefined') {
            globalThis.URL = URL;
        }
        
        // Add process polyfill if missing
        if (typeof globalThis.process === 'undefined') {
            globalThis.process = {
                env: {},
                version: '16.0.0',
                versions: { node: '16.0.0' }
            } as NodeJS.Process;
        }
        
        // Add Buffer polyfill if missing (though this should come from vite plugin)
        if (typeof globalThis.Buffer === 'undefined' && typeof Buffer !== 'undefined') {
            globalThis.Buffer = Buffer;
        }
    }
    
    console.log('[useAuth] Global polyfill status:', {
        hasHeaders: typeof Headers !== 'undefined',
        hasRequest: typeof Request !== 'undefined',
        hasResponse: typeof Response !== 'undefined',
        hasURL: typeof URL !== 'undefined',
        hasProcess: typeof process !== 'undefined',
        hasBuffer: typeof Buffer !== 'undefined',
        hasGlobalThis: typeof globalThis !== 'undefined'
    });
}

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
    
    // Polyfill globals before doing anything else
    polyfillGlobals();
    
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
        console.log('[useAuth] Creating Supabase client with enhanced configuration...');
        
        // Create enhanced fetch function
        const enhancedFetch = createEnhancedFetch();
        if (!enhancedFetch) {
            throw new Error('Failed to create enhanced fetch wrapper');
        }
        
        // Create client with comprehensive configuration for maximum browser compatibility
        const client = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
                storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
                flowType: 'pkce'
            },
            global: {
                // Use our enhanced fetch wrapper
                fetch: enhancedFetch,
                // Ensure Headers constructor is available
                headers: typeof Headers !== 'undefined' ? Headers : undefined,
            },
            // Add additional configuration to handle edge cases
            db: {
                schema: 'public'
            },
            // Disable automatic retries that might cause issues
            realtime: {
                params: {
                    eventsPerSecond: 2
                }
            }
        });
        
        console.log('[useAuth] Supabase client initialized successfully');
        
        // Test client connectivity with comprehensive error handling
        client.auth.getSession().then(() => {
            console.log('[useAuth] Supabase client connectivity test passed');
        }).catch((error) => {
            console.warn('[useAuth] Supabase client connectivity test failed (non-fatal):', {
                error: error instanceof Error ? error.message : String(error),
                timestamp: new Date().toISOString()
            });
        });
        
        return client;
        
    } catch (error) {
        console.error(`[useAuth] Failed to initialize Supabase client (attempt ${attemptNumber}):`, {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            retryCount,
            // Additional debugging info
            globalThisType: typeof globalThis,
            fetchType: typeof fetch,
            headersType: typeof Headers,
            processEnv: typeof process !== 'undefined' ? Object.keys(process.env || {}).length : 0
        });
        
        // Retry logic with progressive backoff
        if (retryCount < MAX_RETRY_ATTEMPTS - 1) {
            const backoffDelay = RETRY_DELAY * (retryCount + 1); // Progressive backoff
            console.log(`[useAuth] Retrying Supabase client initialization in ${backoffDelay}ms...`);
            setTimeout(() => {
                const retryClient = initializeSupabaseClient(retryCount + 1);
                if (retryClient) {
                    supabase = retryClient;
                    console.log('[useAuth] Supabase client retry successful');
                }
            }, backoffDelay);
        } else {
            console.error('[useAuth] All Supabase client initialization attempts failed');
        }
        
        return null;
    }
}

// Build-time environment detection
const isProduction = import.meta.env.PROD;
const isVercelBuild = import.meta.env.VERCEL === '1';
const isDevelopment = import.meta.env.DEV;

console.log('[useAuth] Build environment detected:', {
    isProduction,
    isVercelBuild,
    isDevelopment,
    mode: import.meta.env.MODE
});

// Lazy getter for Supabase client with fallback support
function getSupabaseClient(): ReturnType<typeof createClient> | null {
    if (supabase) {
        return supabase;
    }
    
    console.log('[useAuth] Lazy initializing Supabase client...');
    
    // In production builds, be more aggressive about fallbacks
    if (isProduction || isVercelBuild) {
        try {
            supabase = initializeSupabaseClient();
            if (!supabase) {
                console.warn('[useAuth] Production build: falling back to mock client');
                return createMockSupabaseClient();
            }
            return supabase;
        } catch (error) {
            console.error('[useAuth] Production initialization failed, using mock client:', error);
            return createMockSupabaseClient();
        }
    } else {
        // In development, allow more retries
        supabase = initializeSupabaseClient();
        return supabase;
    }
}

// Create fallback mock client for graceful degradation
function createMockSupabaseClient() {
    console.warn('[useAuth] Creating mock Supabase client for fallback');
    
    const mockAuth = {
        getSession: async () => {
            console.warn('[useAuth] Mock getSession called');
            return { data: { session: null }, error: null };
        },
        signInWithOAuth: async () => {
            console.warn('[useAuth] Mock signInWithOAuth called - authentication unavailable');
            return { data: { provider: null, url: null }, error: { message: 'Authentication unavailable in fallback mode' } };
        },
        signOut: async () => {
            console.warn('[useAuth] Mock signOut called');
            return { error: null };
        },
        onAuthStateChange: () => {
            console.warn('[useAuth] Mock onAuthStateChange called');
            return {
                data: {
                    subscription: {
                        unsubscribe: () => console.warn('[useAuth] Mock unsubscribe called')
                    }
                }
            };
        }
    };
    
    return { auth: mockAuth } as ReturnType<typeof createClient>;
}

// Dynamic import strategy with progressive loading
async function dynamicInitializeSupabaseClient(): Promise<ReturnType<typeof createClient> | null> {
    console.log('[useAuth] Starting dynamic Supabase client initialization...');
    
    // Wait for window to be fully loaded
    if (typeof window === 'undefined') {
        console.log('[useAuth] No window object - skipping dynamic initialization');
        return null;
    }
    
    // Ensure DOM is fully loaded
    if (document.readyState !== 'complete') {
        console.log('[useAuth] Waiting for DOM to be ready...');
        await new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve(void 0);
            } else {
                const handler = () => {
                    if (document.readyState === 'complete') {
                        document.removeEventListener('readystatechange', handler);
                        resolve(void 0);
                    }
                };
                document.addEventListener('readystatechange', handler);
            }
        });
    }
    
    // Add small delay to ensure all polyfills are loaded
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('[useAuth] DOM ready, attempting dynamic client creation...');
    return initializeSupabaseClient();
}

// Enhanced client getter with dynamic loading and fallback (async version for future use)
async function getSupabaseClientAsync(): Promise<ReturnType<typeof createClient> | null> {
    if (supabase) {
        return supabase;
    }
    
    console.log('[useAuth] No existing client, attempting dynamic initialization...');
    const dynamicClient = await dynamicInitializeSupabaseClient();
    
    if (dynamicClient) {
        supabase = dynamicClient;
        console.log('[useAuth] Dynamic client initialization successful');
        return dynamicClient;
    }
    
    console.warn('[useAuth] Dynamic client initialization failed, using mock client');
    return createMockSupabaseClient();
}

// Export for potential future use
export { getSupabaseClientAsync };

// Initial attempt to create client (but don't fail if it doesn't work)
if (typeof window !== 'undefined') {
    // Use setTimeout to ensure this runs after all other initialization
    setTimeout(() => {
        dynamicInitializeSupabaseClient().then(client => {
            if (client) {
                supabase = client;
                console.log('[useAuth] Initial dynamic client creation successful');
            } else {
                console.warn('[useAuth] Initial dynamic client creation failed - will use lazy loading');
            }
        }).catch(error => {
            console.warn('[useAuth] Initial dynamic client creation error:', error);
        });
    }, 0);
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
