import type { IReportRepository } from '../repositories/types';
import type { ReportPayload } from '../types';

export class LocalReportAdapter implements IReportRepository {
  async submitReport(report: ReportPayload): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    // eslint-disable-next-line no-console
    console.info('[report] received', report);
  }
}
