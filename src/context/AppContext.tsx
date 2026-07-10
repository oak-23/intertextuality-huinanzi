import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { Language, DisplayMode, ViewMode, SearchScope } from "../types";
import { LENGTH_MIN_OPEN, LENGTH_MAX_OPEN } from "../utils/parallelFilters";

export interface ParallelPanelState {
  textId: string;
  chapterId: string;
  segmentId: string;
  contextText?: string;
  highlightText?: string;
  highlightRanges?: [number, number][];
  noteEn?: string;
}

export interface SearchState {
  query: string;
  scope: SearchScope;
  matches: string[]; // ordered list of segmentIds
  currentIndex: number;
}

export interface AuthState {
  loggedIn: boolean;
  email: string | null;
}

export interface AppState {
  language: Language;
  displayMode: DisplayMode;
  viewMode: ViewMode;
  sidebarOpen: boolean;
  activeChapterId: string;
  selectedSegmentId: string | null;
  parallelPanel: ParallelPanelState | null;
  panelsSwapped: boolean;
  annotationMode: boolean;
  auth: AuthState;
  searchState: SearchState;
  zoomLevel: number;
  /** Source-text ids whose highlights are toggled OFF in the main text. */
  hiddenTexts: string[];
  /** When set, the right panel shows the numbered parallel list for this source text. */
  parallelListTextId: string | null;
  /** When true (research mode only), bracketed parallel-title citations are hidden in the main text. */
  hideParallelTitles: boolean;
  /** Research-mode length filter: only parallels whose Chinese-character span is
   * within [lengthMin, lengthMax] are highlighted/listed. Open sentinels = no limit. */
  lengthMin: number;
  lengthMax: number;
}

export type AppAction =
  | { type: "SET_LANGUAGE"; language: Language }
  | { type: "SET_DISPLAY_MODE"; displayMode: DisplayMode }
  | { type: "SET_VIEW_MODE"; viewMode: ViewMode }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR"; open: boolean }
  | { type: "SET_ACTIVE_CHAPTER"; chapterId: string }
  | { type: "SELECT_SEGMENT"; segmentId: string | null }
  | { type: "OPEN_PARALLEL"; panel: ParallelPanelState }
  | { type: "CLOSE_PARALLEL" }
  | { type: "TOGGLE_SWAP_PANELS" }
  | { type: "TOGGLE_ANNOTATION_MODE" }
  | { type: "SET_AUTH"; auth: AuthState }
  | { type: "SET_SEARCH_QUERY"; query: string }
  | { type: "SET_SEARCH_SCOPE"; scope: SearchScope }
  | { type: "SET_SEARCH_MATCHES"; matches: string[] }
  | { type: "SET_SEARCH_INDEX"; index: number }
  | { type: "SET_ZOOM_LEVEL"; zoomLevel: number }
  | { type: "TOGGLE_TEXT_HIGHLIGHT"; textId: string }
  | { type: "TOGGLE_PARALLEL_TITLES" }
  | { type: "OPEN_PARALLEL_LIST"; textId: string }
  | { type: "OPEN_PARALLEL_IN_LIST"; panel: ParallelPanelState }
  | { type: "CLOSE_PARALLEL_LIST" }
  | { type: "SET_LENGTH_RANGE"; min: number; max: number };

export const initialAppState: AppState = {
  language: "zh",
  displayMode: "rhymed",
  viewMode: "normal",
  sidebarOpen: true,
  activeChapterId: "chap-1",
  selectedSegmentId: null,
  parallelPanel: null,
  panelsSwapped: false,
  annotationMode: false,
  auth: { loggedIn: false, email: null },
  searchState: { query: "", scope: "all", matches: [], currentIndex: 0 },
  zoomLevel: 1,
  hiddenTexts: [],
  parallelListTextId: null,
  hideParallelTitles: false,
  lengthMin: LENGTH_MIN_OPEN,
  lengthMax: LENGTH_MAX_OPEN,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LANGUAGE":
      return { ...state, language: action.language };
    case "SET_DISPLAY_MODE":
      return { ...state, displayMode: action.displayMode };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.viewMode };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "SET_SIDEBAR":
      return { ...state, sidebarOpen: action.open };
    case "SET_ACTIVE_CHAPTER":
      return {
        ...state,
        activeChapterId: action.chapterId,
        selectedSegmentId: null,
        parallelPanel: null,
        parallelListTextId: null,
        panelsSwapped: false,
      };
    case "SELECT_SEGMENT":
      return { ...state, selectedSegmentId: action.segmentId };
    case "OPEN_PARALLEL":
      return {
        ...state,
        parallelPanel: action.panel,
        parallelListTextId: null,
      };
    case "CLOSE_PARALLEL":
      return { ...state, parallelPanel: null, panelsSwapped: false };
    case "TOGGLE_SWAP_PANELS":
      return { ...state, panelsSwapped: !state.panelsSwapped };
    case "TOGGLE_ANNOTATION_MODE":
      return { ...state, annotationMode: !state.annotationMode };
    case "SET_AUTH":
      return { ...state, auth: action.auth };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchState: { ...state.searchState, query: action.query },
      };
    case "SET_SEARCH_SCOPE":
      return {
        ...state,
        searchState: {
          ...state.searchState,
          scope: action.scope,
          matches: [],
          currentIndex: 0,
        },
      };
    case "SET_SEARCH_MATCHES":
      return {
        ...state,
        searchState: {
          ...state.searchState,
          matches: action.matches,
          currentIndex: 0,
        },
      };
    case "SET_SEARCH_INDEX":
      return {
        ...state,
        searchState: { ...state.searchState, currentIndex: action.index },
      };
    case "SET_ZOOM_LEVEL":
      return { ...state, zoomLevel: action.zoomLevel };
    case "TOGGLE_TEXT_HIGHLIGHT":
      return {
        ...state,
        hiddenTexts: state.hiddenTexts.includes(action.textId)
          ? state.hiddenTexts.filter((t) => t !== action.textId)
          : [...state.hiddenTexts, action.textId],
      };
    case "OPEN_PARALLEL_LIST":
      return {
        ...state,
        parallelListTextId: action.textId,
        parallelPanel: null,
      };
    case "OPEN_PARALLEL_IN_LIST":
      return { ...state, parallelPanel: action.panel };
    case "CLOSE_PARALLEL_LIST":
      return {
        ...state,
        parallelPanel: null,
        parallelListTextId: null,
        panelsSwapped: false,
      };
    case "TOGGLE_PARALLEL_TITLES":
      return { ...state, hideParallelTitles: !state.hideParallelTitles };
    case "SET_LENGTH_RANGE":
      return { ...state, lengthMin: action.min, lengthMax: action.max };
    default:
      return state;
  }
}

export interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
  // Convenience action creators
  setLanguage: (language: Language) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  setActiveChapter: (chapterId: string) => void;
  selectSegment: (segmentId: string | null) => void;
  openParallel: (panel: ParallelPanelState) => void;
  closeParallel: () => void;
  toggleSwapPanels: () => void;
  toggleAnnotationMode: () => void;
  setAuth: (auth: AuthState) => void;
  setZoomLevel: (zoomLevel: number) => void;
  toggleTextHighlight: (textId: string) => void;
  toggleParallelTitles: () => void;
  openParallelList: (textId: string) => void;
  openParallelInList: (panel: ParallelPanelState) => void;
  closeParallelList: () => void;
  setLengthRange: (min: number, max: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export interface AppProviderProps {
  children: ReactNode;
  initialState?: Partial<AppState>;
}

export function AppProvider({ children, initialState }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialAppState,
    ...initialState,
  });

  const setLanguage = useCallback(
    (language: Language) => dispatch({ type: "SET_LANGUAGE", language }),
    [],
  );
  const setDisplayMode = useCallback(
    (mode: DisplayMode) =>
      dispatch({ type: "SET_DISPLAY_MODE", displayMode: mode }),
    [],
  );
  const setViewMode = useCallback(
    (mode: ViewMode) => dispatch({ type: "SET_VIEW_MODE", viewMode: mode }),
    [],
  );
  const toggleSidebar = useCallback(
    () => dispatch({ type: "TOGGLE_SIDEBAR" }),
    [],
  );
  const setActiveChapter = useCallback(
    (chapterId: string) => dispatch({ type: "SET_ACTIVE_CHAPTER", chapterId }),
    [],
  );
  const selectSegment = useCallback(
    (segmentId: string | null) =>
      dispatch({ type: "SELECT_SEGMENT", segmentId }),
    [],
  );
  const openParallel = useCallback(
    (panel: ParallelPanelState) => dispatch({ type: "OPEN_PARALLEL", panel }),
    [],
  );
  const closeParallel = useCallback(
    () => dispatch({ type: "CLOSE_PARALLEL" }),
    [],
  );
  const toggleSwapPanels = useCallback(
    () => dispatch({ type: "TOGGLE_SWAP_PANELS" }),
    [],
  );
  const toggleAnnotationMode = useCallback(
    () => dispatch({ type: "TOGGLE_ANNOTATION_MODE" }),
    [],
  );
  const setAuth = useCallback(
    (auth: AuthState) => dispatch({ type: "SET_AUTH", auth }),
    [],
  );
  const setZoomLevel = useCallback(
    (zoomLevel: number) => dispatch({ type: "SET_ZOOM_LEVEL", zoomLevel }),
    [],
  );
  const toggleTextHighlight = useCallback(
    (textId: string) => dispatch({ type: "TOGGLE_TEXT_HIGHLIGHT", textId }),
    [],
  );
  const toggleParallelTitles = useCallback(
    () => dispatch({ type: "TOGGLE_PARALLEL_TITLES" }),
    [],
  );
  const openParallelList = useCallback(
    (textId: string) => dispatch({ type: "OPEN_PARALLEL_LIST", textId }),
    [],
  );
  const openParallelInList = useCallback(
    (panel: ParallelPanelState) =>
      dispatch({ type: "OPEN_PARALLEL_IN_LIST", panel }),
    [],
  );
  const closeParallelList = useCallback(
    () => dispatch({ type: "CLOSE_PARALLEL_LIST" }),
    [],
  );
  const setLengthRange = useCallback(
    (min: number, max: number) =>
      dispatch({ type: "SET_LENGTH_RANGE", min, max }),
    [],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      dispatch,
      setLanguage,
      setDisplayMode,
      setViewMode,
      toggleSidebar,
      setActiveChapter,
      selectSegment,
      openParallel,
      closeParallel,
      toggleSwapPanels,
      toggleAnnotationMode,
      setAuth,
      setZoomLevel,
      toggleTextHighlight,
      toggleParallelTitles,
      openParallelList,
      openParallelInList,
      closeParallelList,
      setLengthRange,
    }),
    [
      state,
      setLanguage,
      setDisplayMode,
      setViewMode,
      toggleSidebar,
      setActiveChapter,
      selectSegment,
      openParallel,
      closeParallel,
      toggleSwapPanels,
      toggleAnnotationMode,
      setAuth,
      setZoomLevel,
      toggleTextHighlight,
      toggleParallelTitles,
      openParallelList,
      openParallelInList,
      closeParallelList,
      setLengthRange,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside an AppProvider");
  return ctx;
}
