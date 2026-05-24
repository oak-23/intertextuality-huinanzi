import type {
  Text,
  Chapter,
  Segment,
  Annotation,
  SearchResult,
  AuthResult,
  AuthSession,
  Language,
  SearchScope,
  ReportPayload,
} from '../types';

export interface ITextRepository {
  getMainText(): Text;
  getChapter(chapterId: string): Chapter | null;
  getParallelText(textId: string): Text | null;
  getParallelChapter(textId: string, chapterId: string): Chapter | null;
  getSegment(textId: string, chapterId: string, segmentId: string): Segment | null;
  searchSegments(query: string, scope: SearchScope, lang: Language): SearchResult[];
  getAllParallelTexts(): Text[];
}

export interface IAnnotationRepository {
  getAnnotations(chapterId: string): Annotation[];
  saveAnnotation(annotation: Annotation): void;
  deleteAnnotation(annotationId: string): void;
  updateAnnotation(annotationId: string, comment: string): void;
  /** Subscribe to changes — returns an unsubscribe function. */
  subscribe(listener: () => void): () => void;
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthResult>;
  logout(): void;
  getSession(): AuthSession | null;
  register(email: string, password: string): Promise<AuthResult>;
}

export interface IReportRepository {
  submitReport(report: ReportPayload): Promise<void>;
}

export interface Repositories {
  texts: ITextRepository;
  annotations: IAnnotationRepository;
  auth: IAuthRepository;
  reports: IReportRepository;
}
