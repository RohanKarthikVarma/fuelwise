
'use client';

import React from 'react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Firebase Auth has been removed, so we just render the children.
  return <>{children}</>;
};

export const useAuth = () => {
    // Return a mock user object since auth is disabled.
    return { user: { uid: 'anonymous' }, loading: false };
};
