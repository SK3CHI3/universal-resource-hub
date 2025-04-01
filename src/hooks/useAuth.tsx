
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { Profile, Subscription } from '@/types';

type UserJourney = {
  hasCompletedOnboarding: boolean;
  lastVisitedResource: string | null;
  favoriteCategories: string[];
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  isLoading: boolean;
  userJourney: UserJourney;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  checkPremiumStatus: () => Promise<boolean>;
  updateUserJourney: (journeyUpdate: Partial<UserJourney>) => Promise<void>;
};

// Default user journey
const defaultUserJourney: UserJourney = {
  hasCompletedOnboarding: false,
  lastVisitedResource: null,
  favoriteCategories: [],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [userJourney, setUserJourney] = useState<UserJourney>(defaultUserJourney);
  const { toast } = useToast();

  useEffect(() => {
    const setupAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check active session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          const isPremium = await checkPremiumStatus();
          setIsPremium(isPremium);
          await loadUserJourney(session.user.id);
        }
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          setSession(session);
          setUser(session?.user || null);
          
          if (session?.user) {
            const isPremium = await checkPremiumStatus();
            setIsPremium(isPremium);
            await loadUserJourney(session.user.id);
          } else {
            setIsPremium(false);
            setUserJourney(defaultUserJourney);
          }
        });
        
        // Cleanup subscription
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    setupAuth();
  }, []);

  const loadUserJourney = async (userId: string) => {
    try {
      // Check if we have user journey data
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error loading user journey:', error);
        return;
      }
      
      if (data) {
        // Convert database structure to userJourney format
        setUserJourney({
          hasCompletedOnboarding: data.has_completed_onboarding || false,
          lastVisitedResource: data.last_visited_resource,
          favoriteCategories: data.favorite_categories || [],
        });
      }
    } catch (err) {
      console.error('Error in loadUserJourney:', err);
    }
  };

  const updateUserJourney = async (journeyUpdate: Partial<UserJourney>) => {
    if (!user) return;
    
    try {
      const updatedJourney = { ...userJourney, ...journeyUpdate };
      setUserJourney(updatedJourney);
      
      // Convert to database structure
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          has_completed_onboarding: updatedJourney.hasCompletedOnboarding,
          last_visited_resource: updatedJourney.lastVisitedResource,
          favorite_categories: updatedJourney.favoriteCategories,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Failed to update preferences",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const checkPremiumStatus = async (): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Check profile premium status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, is_premium')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching premium status:', profileError);
        return false;
      }
      
      // Call the function to get active subscriptions
      const { data: subscriptions, error: functionError } = await supabase
        .rpc('get_user_subscriptions', { p_user_id: user.id });
      
      if (functionError) {
        console.error('Error calling get_user_subscriptions function:', functionError);
        
        // Fallback to a direct query if the RPC function has issues
        const { data: subData, error: directSubError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .gt('end_date', new Date().toISOString());
          
        if (directSubError) {
          console.error('Error fetching subscription status:', directSubError);
          return Boolean(profile?.is_premium);
        }
        
        return Boolean(profile?.is_premium) || (subData && subData.length > 0);
      }
      
      const hasActiveSubscription = subscriptions && subscriptions.length > 0;
      return Boolean(profile?.is_premium) || hasActiveSubscription;
    } catch (err) {
      console.error('Error checking premium status:', err);
      return false;
    }
  };

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        const isPremium = await checkPremiumStatus();
        setIsPremium(isPremium);
        await loadUserJourney(session.user.id);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Welcome back!",
          description: `You've successfully signed in.`,
          duration: 3000,
        });
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) throw error;
      
      // After signup, update the user's profile with their name
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            full_name: fullName,
            email: email 
          })
          .eq('id', data.user.id);
        
        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAuthenticated: !!user,
        isPremium,
        isLoading,
        userJourney,
        signIn,
        signUp,
        signOut,
        refreshSession,
        checkPremiumStatus,
        updateUserJourney,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
