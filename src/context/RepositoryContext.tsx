import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Repositories } from '../repositories/types';
import { createTextRepository } from '../repositories/textRepository';
import { createAnnotationRepository } from '../repositories/annotationRepository';
import { createAuthRepository } from '../repositories/authRepository';
import { createReportRepository } from '../repositories/reportRepository';

const RepositoryContext = createContext<Repositories | null>(null);

export interface RepositoryProviderProps {
  /** Optional override for tests / Storybook. Defaults to local adapters. */
  value?: Partial<Repositories>;
  children: ReactNode;
}

export function RepositoryProvider({ value, children }: RepositoryProviderProps) {
  const repos: Repositories = useMemo(
    () => ({
      texts: value?.texts ?? createTextRepository(),
      annotations: value?.annotations ?? createAnnotationRepository(),
      auth: value?.auth ?? createAuthRepository(),
      reports: value?.reports ?? createReportRepository(),
    }),
    [value]
  );

  return <RepositoryContext.Provider value={repos}>{children}</RepositoryContext.Provider>;
}

export function useRepositories(): Repositories {
  const ctx = useContext(RepositoryContext);
  if (!ctx) {
    throw new Error('useRepositories must be used inside a RepositoryProvider');
  }
  return ctx;
}
