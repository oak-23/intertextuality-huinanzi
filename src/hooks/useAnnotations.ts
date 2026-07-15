import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRepositories } from '../context/RepositoryContext';
import type { Annotation } from '../types';

export interface UseAnnotationsReturn {
  annotations: Annotation[];
  countForSegment: (segmentId: string) => number;
  forSegment: (segmentId: string) => Annotation[];
  getAnnotationById: (id: string) => Annotation | undefined;
  save: (input: {
    segmentId?: string;
    comment: string;
    startIndex?: number;
    endIndex?: number;
    language?: "zh" | "en";
    selectedText?: string;
  }) => void;
  remove: (annotationId: string) => void;
  update: (annotationId: string, comment: string) => void;
}

export function useAnnotations(chapterId: string): UseAnnotationsReturn {
  const { annotations: repo } = useRepositories();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    return repo.subscribe(() => setVersion((v) => v + 1));
  }, [repo]);

  const annotations = useMemo(
    () => repo.getAnnotations(chapterId),
    // version intentionally in deps so getAnnotations re-runs on save
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [repo, chapterId, version]
  );

  const countForSegment = useCallback(
    (segmentId: string) => annotations.filter((a) => a.segmentId === segmentId).length,
    [annotations]
  );

  const forSegment = useCallback(
    (segmentId: string) => annotations.filter((a) => a.segmentId === segmentId),
    [annotations]
  );

  const getAnnotationById = useCallback(
    (id: string) => annotations.find((a) => a.id === id),
    [annotations]
  );

  const save = useCallback(
    ({
      segmentId,
      comment,
      startIndex,
      endIndex,
      language,
      selectedText,
    }: {
      segmentId?: string;
      comment: string;
      startIndex?: number;
      endIndex?: number;
      language?: "zh" | "en";
      selectedText?: string;
    }) => {
      const annotation: Annotation = {
        id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        chapterId,
        segmentId,
        comment,
        startIndex,
        endIndex,
        language,
        selectedText,
        createdAt: new Date().toISOString(),
      };
      repo.saveAnnotation(annotation);
    },
    [chapterId, repo]
  );

  const remove = useCallback((annotationId: string) => repo.deleteAnnotation(annotationId), [repo]);
  const update = useCallback(
    (annotationId: string, comment: string) => repo.updateAnnotation(annotationId, comment),
    [repo]
  );

  return { annotations, countForSegment, forSegment, getAnnotationById, save, remove, update };
}
