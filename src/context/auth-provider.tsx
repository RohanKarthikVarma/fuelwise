
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error('Anonymous sign-in failed:', error);
          setLoading(false);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="mx-auto grid w-full max-w-lg gap-12">
            <div className='space-y-4'>
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-10 w-1/2" />
            </div>
             <div className='space-y-4'>
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
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
