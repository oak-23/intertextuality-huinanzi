import { LocalReportAdapter } from '../adapters/localReportAdapter';
import type { IReportRepository } from './types';

export function createReportRepository(): IReportRepository {
  return new LocalReportAdapter();
}
