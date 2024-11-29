import { DependencyList, EffectCallback } from "react";

import { useAsync } from "./useAsync";

/**
 * Wraps and creates a memo-like result using the `useState`
 * 
 * `useMemoAsync` will only recompute the memoized value when one of the `deps` has changed
 * 
 * **Note**: Just like with the native `useMemo`, this will return the previous value until the calculation has changed
 * @param factory Asynchronous function to call
 * @param deps Dependency List
 * @param destructor Destructor
 * @returns `TResult | undefined`
 */
export function useMemoAsync<TResult>(factory: (abortSignal: AbortController) => Promise<TResult>, deps: DependencyList, destructor?: ReturnType<EffectCallback>) : TResult | undefined {
    const [ result ] = useAsync(factory, deps, destructor);

    return result;
}
