import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types/editor';

interface AuthContextType {
  user: UserProfile;
  signInWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  signOut: () => void;
  updateProfilePicture: (url: string) => void;
  updateProfileName: (name: string) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const GUEST_USER: UserProfile = {
  id: 'guest_user',
  name: 'Creator',
  email: 'creator@snapedit.studio',
  photoUrl: '/assets/aistudio/image_10b91270.png',
  isGuest: true,
  createdAt: Date.now(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('snapedit_user');
      return saved ? JSON.parse(saved) : GUEST_USER;
    } catch {
      return GUEST_USER;
    }
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('snapedit_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Could not persist user to localStorage', e);
    }
  }, [user]);

  const signInWithGoogle = useCallback(async () => {
    const googleUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: 'Pro Creator',
      email: 'creator@snapedit.studio',
      photoUrl: '/assets/aistudio/image_10b91270.png',
      isGuest: false,
      createdAt: Date.now(),
    };
    setUser(googleUser);
    setShowAuthModal(false);
  }, []);

  const continueAsGuest = useCallback(() => {
    setUser(GUEST_USER);
    setShowAuthModal(false);
  }, []);

  const signOut = useCallback(() => {
    setUser(GUEST_USER);
  }, []);

  const updateProfilePicture = useCallback((url: string) => {
    setUser((prev) => ({ ...prev, photoUrl: url }));
  }, []);

  const updateProfileName = useCallback((name: string) => {
    setUser((prev) => ({ ...prev, name }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        continueAsGuest,
        signOut,
        updateProfilePicture,
        updateProfileName,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
