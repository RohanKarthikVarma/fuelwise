
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
        <div className="flex min-h-screen w-full flex-col bg-background">
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
              <div className="mr-4 hidden md:flex">
                  <Skeleton className="h-6 w-32" />
              </div>
              <div className="flex flex-1 items-center justify-end">
                  <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </header>
          <main className="flex-1">
            <div className="container relative py-8 md:py-12">
                <div className="mx-auto grid w-full max-w-3xl justify-center gap-12">
                  <div className="flex flex-col items-center gap-4 text-center">
                      <Skeleton className="h-12 w-80" />
                      <Skeleton className="h-6 w-full max-w-[700px]" />
                  </div>
                  <Skeleton className="h-96 w-full" />
                </div>
            </div>
          </main>
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
