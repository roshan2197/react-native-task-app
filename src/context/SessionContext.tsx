import { createContext, useContext, useState, type ReactNode } from 'react';

import {
  signInUseCase,
  type SessionUser,
} from '../usecases/auth/signInUseCase';

type SessionContextValue = {
  session: SessionUser | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionUser | null>(null);

  const signIn = async (username: string, password: string) => {
    const nextSession = await signInUseCase(username, password);
    setSession(nextSession);
  };

  const signOut = () => {
    setSession(null);
  };

  return (
    <SessionContext.Provider value={{ session, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
}
