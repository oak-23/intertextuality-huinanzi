import { useCallback, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useRepositories } from '../context/RepositoryContext';
import type { AuthResult } from '../types';

export interface UseAuthReturn {
  loggedIn: boolean;
  email: string | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const { auth: repo } = useRepositories();
  const { state, setAuth } = useApp();

  useEffect(() => {
    const session = repo.getSession();
    if (session && !state.auth.loggedIn) {
      setAuth({ loggedIn: true, email: session.email });
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await repo.login(email, password);
      if (result.success && result.email) {
        setAuth({ loggedIn: true, email: result.email });
      }
      return result;
    },
    [repo, setAuth]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      const result = await repo.register(email, password);
      if (result.success && result.email) {
        setAuth({ loggedIn: true, email: result.email });
      }
      return result;
    },
    [repo, setAuth]
  );

  const logout = useCallback(() => {
    repo.logout();
    setAuth({ loggedIn: false, email: null });
  }, [repo, setAuth]);

  return {
    loggedIn: state.auth.loggedIn,
    email: state.auth.email,
    login,
    register,
    logout,
  };
}
