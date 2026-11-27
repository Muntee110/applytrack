"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const AuthContext = React.createContext({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetchProfile = React.useCallback(async (currentUser) => {
    if (!currentUser) return null;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
        return data;
      }
    } catch (err) {
      console.warn("Could not fetch profile from Supabase:", err);
    }
    return null;
  }, []);

  const refreshUser = React.useCallback(async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
      return currentUser;
    } catch (err) {
      console.error("Error refreshing user:", err);
      return null;
    }
  }, [fetchProfile]);

  React.useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            fetchProfile(session.user);
          } else {
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  // Protect dashboard routes: redirect unauthenticated users to /login
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router, pathname]);

  const signOut = React.useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error during signOut:", err);
    } finally {
      setUser(null);
      setProfile(null);
      router.push("/login");
      router.refresh();
    }
  }, [router]);

  const value = React.useMemo(
    () => ({
      user,
      profile,
      loading,
      signOut,
      refreshUser,
    }),
    [user, profile, loading, signOut, refreshUser]
  );

  // On client side, handle loading spinner and unauthenticated redirect
  if (typeof window !== "undefined") {
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Loading ApplyTrack...
            </p>
          </div>
        </div>
      );
    }

    if (!user) {
      return null;
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
