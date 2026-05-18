import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/config';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUser = (user) => {
    setCurrentUser(user);
    // Hardcoded admin check for Anchor Customs
    const adminEmail = 'karampreets090@gmail.com';

    if (user && user.email?.toLowerCase() === adminEmail) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
  };

  const demoLogin = () => {
    const devUser = {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'karampreets090@gmail.com',
      user_metadata: { full_name: 'Developer Admin', avatar_url: null }
    };
    setCurrentUser(devUser);
    setIsAdmin(true);
    setLoading(false);
    toast.success('Developer Admin Access Granted!');
  };

  const value = {
    currentUser,
    isAdmin,
    signInWithGoogle,
    logout,
    demoLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
