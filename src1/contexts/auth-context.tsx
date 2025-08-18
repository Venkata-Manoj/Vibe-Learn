
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<any>;
  signIn: (email: string, pass: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, pass: string) => {
    if (!isFirebaseConfigured()) return Promise.reject(new Error("Firebase is not configured."));
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const displayName = email.split('@')[0];
    await updateProfile(userCredential.user, { displayName });
    // Reload the user to get the updated profile information
    await userCredential.user.reload();
    setUser(auth.currentUser);
    return userCredential;
  };

  const signIn = (email: string, pass: string) => {
    if (!isFirebaseConfigured()) return Promise.reject(new Error("Firebase is not configured."));
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signInWithGoogle = () => {
    if (!isFirebaseConfigured()) return Promise.reject(new Error("Firebase is not configured."));
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  const signOutUser = async () => {
    if (!isFirebaseConfigured()) return;
    await signOut(auth);
    router.push('/login');
  };
  
  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, signIn, signInWithGoogle, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
