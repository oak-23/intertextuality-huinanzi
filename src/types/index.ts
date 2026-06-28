export type Language = "zh" | "en";
export type DisplayMode = "prose" | "rhymed";
export type ViewMode = "normal" | "research";
export type SearchScope = "main" | "parallel";

export type ColorKey =
  | "laozi"
  | "zhuangzi"
  | "lushi-chunqiu"
  | "wenzi"
  | "guanzi"
  | "hanfeizi"
  | "shanhaijing"
  | "shiji"
  | "xunzi"
  | "liji";

export interface BiLingual {
  zh: string;
  en: string;
}

export interface Parallel {
  textId: string;
  chapterId: string;
  segmentId: string;
  colorKey: ColorKey;
  comment?: string;
}

export interface Segment {
  id: string;
  content: {
    zh: string;
    en: string;
    zhRhymed?: string;
    enRhymed?: string;
  };
  parallels?: Parallel[];
}

export interface Chapter {
  id: string;
  title: BiLingual;
  segments: Segment[];
}

/** A highlighted span within continuous text that references a parallel */
export interface InlineParallel {
  /** Character index range in the Chinese text */
  startZh: number;
  endZh: number;
  /** Character index range in the English text */
  startEn: number;
  endEn: number;
  /** The parallel reference */
  textId: string;
  chapterId: string;
  segmentId: string;
  colorKey: ColorKey;
  zhMatch?: string;
  enMatch?: string;
  zhContext?: string;
  enContext?: string;
  comment?: string;
}

export interface ParallelOption {
  textId: string;
  chapterId: string;
  segmentId: string;
  colorKey: ColorKey;
  zhMatch?: string;
  enMatch?: string;
  zhContext?: string;
  enContext?: string;
  comment?: string;
}

/** A chapter with continuous (unsegmented) text */
export interface ContinuousChapter {
  id: string;
  title: BiLingual;
  /** Full continuous text of the chapter */
  text: BiLingual;
  /** Inline highlight ranges referencing parallels */
  inlineParallels: InlineParallel[];
}

/** A text with continuous (unsegmented) chapters */
export interface ContinuousText {
  id: string;
  title: BiLingual;
  chapters: ContinuousChapter[];
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
