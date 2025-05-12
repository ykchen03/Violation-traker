import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { User, AuthState } from '../types';
import { useRouter } from 'next/navigation';

export const useAuth = (): AuthState & {
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
} => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Get user data from your users table
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setState({
            user: data as User,
            loading: false,
          });
        } else {
          setState({
            user: null,
            loading: false,
          });
        }
      }
    );

    // Initial session check
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setState({
          user: data as User,
          loading: false,
        });
      } else {
        setState({
          user: null,
          loading: false,
        });
      }
    };
    
    checkUser();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return {
    ...state,
    signIn,
    signOut,
  };
};

export const withAuth = (Component: React.FC) => {
  const Auth = (props: any) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);
    
    if (loading) {
      return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
    
    if (!user) {
      return null;
    }
    
    return <Component {...props} />;
  };
  
  return Auth;
};