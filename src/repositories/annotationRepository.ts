import { LocalAnnotationAdapter } from '../adapters/localAnnotationAdapter';
import type { IAnnotationRepository } from './types';

export function createAnnotationRepository(): IAnnotationRepository {
  return new LocalAnnotationAdapter();
}
