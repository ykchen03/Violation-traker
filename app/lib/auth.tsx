"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, AuthState } from '../types';

export function useAuth(): AuthState & {
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
} {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const user = session?.user as User | null;
  const loading = status === "loading";

  const handleSignIn = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { error: result?.error ? new Error(result.error) : null };
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return {
    user,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}

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