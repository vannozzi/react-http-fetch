import { DependencyList, useCallback } from 'react';
import { useCompareRef } from './use-compare-ref';

export type DepsAreEqual = (prevDeps: DependencyList, nextDeps: DependencyList) => boolean;

export function useCompareCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: DependencyList,
  compare: DepsAreEqual
): T {
  const depsRef = useCompareRef(deps, compare);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, depsRef.current);
}
