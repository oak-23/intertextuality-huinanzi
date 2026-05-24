import type { IAnnotationRepository } from '../repositories/types';
import type { Annotation } from '../types';

const STORAGE_KEY = 'huinanzi:annotations:v1';

export class LocalAnnotationAdapter implements IAnnotationRepository {
  private listeners = new Set<() => void>();

  private readAll(): Annotation[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Annotation[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(annotations: Annotation[]): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
    this.emit();
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }

  getAnnotations(chapterId: string): Annotation[] {
    return this.readAll().filter((a) => a.chapterId === chapterId);
  }

  saveAnnotation(annotation: Annotation): void {
    const all = this.readAll();
    all.push(annotation);
    this.writeAll(all);
  }

  deleteAnnotation(annotationId: string): void {
    const all = this.readAll().filter((a) => a.id !== annotationId);
    this.writeAll(all);
  }

  updateAnnotation(annotationId: string, comment: string): void {
    const all = this.readAll().map((a) =>
      a.id === annotationId ? { ...a, comment } : a
    );
    this.writeAll(all);
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
