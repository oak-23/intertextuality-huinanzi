export type Language = 'zh' | 'en';
export type DisplayMode = 'prose' | 'rhymed';
export type ViewMode = 'normal' | 'research';
export type SearchScope = 'main' | 'parallel';

export type ColorKey =
  | 'laozi'
  | 'zhuangzi'
  | 'lushi-chunqiu'
  | 'wenzi'
  | 'guanzi'
  | 'hanfeizi'
  | 'shanhaijing'
  | 'shiji';

export interface BiLingual {
  zh: string;
  en: string;
}

export interface Parallel {
  textId: string;
  chapterId: string;
  segmentId: string;
  colorKey: ColorKey;
}

export interface Segment {
  id: string;
  content: {
    zh: string;
    en: string;
    zhRhymed?: string;
    enRhymed?: string;
  };
  parallels: Parallel[];
}

export interface Chapter {
  id: string;
  title: BiLingual;
  segments: Segment[];
}

export interface Text {
  id: string;
  title: BiLingual;
  colorKey?: ColorKey;
  chapters: Chapter[];
}

export interface Annotation {
  id: string;
  segmentId: string;
  chapterId: string;
  comment: string;
  createdAt: string;
}

export interface SearchResult {
  textId: string;
  chapterId: string;
  segmentId: string;
  matchedText: string;
}

export interface AuthResult {
  success: boolean;
  email?: string;
  error?: string;
}

export interface AuthSession {
  email: string;
  loggedInAt: string;
}

export interface ReportPayload {
  name: string;
  email: string;
  message: string;
}
