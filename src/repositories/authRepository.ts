import { LocalAuthAdapter } from '../adapters/localAuthAdapter';
import type { IAuthRepository } from './types';

export function createAuthRepository(): IAuthRepository {
  return new LocalAuthAdapter();
}
