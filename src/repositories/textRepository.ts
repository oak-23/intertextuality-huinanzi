import { LocalTextAdapter } from '../adapters/localTextAdapter';
import type { ITextRepository } from './types';

export function createTextRepository(): ITextRepository {
  return new LocalTextAdapter();
}
