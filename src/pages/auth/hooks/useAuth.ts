// src/components/SignInPage/hooks/useAuth.ts

import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import supabase from "../../../supabase";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    // Listen for changes in authentication state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState((prev) => ({
          ...prev,
          user: session?.user ?? null,
          session: session,
        }));
      }
    );

    // Fetch the initial session
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching initial session:", error);
      } else {
        setAuthState((prev) => ({
          ...prev,
          user: session?.user ?? null,
          session: session,
        }));
      }
    };

    fetchSession();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        throw new Error(error?.message || "Authentication failed.");
      }

      setAuthState({
        user: data.user,
        session: data.session,
        loading: false,
        error: null,
      });

      return { user: data.user, session: data.session };
    } catch (err: any) {
      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: err.message,
      });
      throw err;
    }
  };

  const signOut = async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: err.message,
      }));
      throw err;
    }
  };

  return { authState, signIn, signOut };
};

export default useAuth;

