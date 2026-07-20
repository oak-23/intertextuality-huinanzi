export type Language = "zh" | "en";
export type DisplayMode = "prose" | "rhymed";
export type Theme = "light" | "dark";
export type SearchScope = "all" | "main" | "parallel";

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
  | "liji"
  | "shenzi"
  | "zhanguoce"
  | "lunyu"
  | "mengzi"
  | "annotation";

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
  zhContextRanges?: [number, number][];
  noteEn?: string;
  /** Docx footnote display number (1-based) for this parallel's unit */
  footnote?: number;
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
  zhContextRanges?: [number, number][];
  noteEn?: string;
}

/** One line of the rhymed version with its scholarly annotations */
export interface RhymedLine {
  zh: string;
  /** Old Chinese rhyme-group label, e.g. 職, 耕平 */
  rhyme?: string;
  /** Rhyme-unit number, e.g. 1.1, 2.15 */
  unit?: string;
  /** Editorial marker, e.g. A */
  marker?: string;
}

/** The rhymed version of a chapter (research mode) */
export interface RhymedContent {
  /** Line texts joined with \n; parallel offsets index into this string */
  text: string;
  lines: RhymedLine[];
  inlineParallels: InlineParallel[];
}

/** A chapter with continuous (unsegmented) text */
export interface ContinuousChapter {
  id: string;
  title: BiLingual;
  /** Full continuous text of the chapter */
  text: BiLingual;
  /** Inline highlight ranges referencing parallels */
  inlineParallels: InlineParallel[];
  /** Optional rhymed version, viewable in research mode */
  rhymed?: RhymedContent;
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
  chapterId: string;
  segmentId?: string;
  comment: string;
  createdAt: string;
  
  startIndex?: number;
  endIndex?: number;
  language?: "zh" | "en";
  selectedText?: string;
  rhymed?: boolean;
}

export interface SearchResult {
  textId: string;
  chapterId: string;
  segmentId: string;
  matchedText: string;
  /** Character offset of the match within the continuous chapter text (main scope only). */
  matchOffset?: number;
  /** Exact length of the match within the continuous chapter text */
  matchLength?: number;
  /** The N-th occurrence of this query in the chapter */
  matchIndex?: number;
  /** The exact query string that was matched */
  matchQuery?: string;
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
