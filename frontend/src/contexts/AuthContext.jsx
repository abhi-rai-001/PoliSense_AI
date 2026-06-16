import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange } from '../lib/supabase';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginAsDev = () => {
    setUser({
      id: 'dev-user-123',
      email: 'dev@example.com',
      displayName: 'Dev User',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev'
    });
    setLoading(false);
  };


  const value = {
    user,
    loading,
    isSignedIn: !!user,
    userId: user?.id,
    loginAsDev
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 