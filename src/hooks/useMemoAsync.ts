import { DependencyList, EffectCallback, useState } from "react";

import { useEffectAsync } from "./useEffectAsync";

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
export function useMemoAsync<TResult>(factory: (abortSignal: AbortSignal) => Promise<TResult>, deps: DependencyList, destructor?: ReturnType<EffectCallback>) : TResult {
    const [ result, setResult ] = useState<TResult>(undefined);

    useEffectAsync(async (signal) => {
        const result = await factory(signal);

        setResult(result);
    }, deps, destructor);

    return result;
}
