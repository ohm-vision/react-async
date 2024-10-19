import { DependencyList, EffectCallback, useState } from "react";

import { useEffectAsync } from "../effects/useEffectAsync";

/**
 * Wraps and creates a memo-like result using the `useState`
 * 
 * `useAsync` will only recompute the memoized value when one of the `deps` has changed
 * 
 * **Note**: Just like with the native `useMemo`, this will return the previous value until the calculation has changed
 * @param factory Asynchronous function to call
 * @param deps Dependency List
 * @param destructor Destructor
 * @returns [ `boolean`, `TResult | undefined` ]
 */
export function useAsync<TResult>(factory: (abortSignal: AbortSignal) => Promise<TResult>, deps: DependencyList, destructor?: ReturnType<EffectCallback>) : [boolean, TResult] {
    const [ result, setResult ] = useState<TResult>(undefined);

    const loading = useEffectAsync(async (signal) => {
        const result = await factory(signal);

        setResult(result);
    }, deps, destructor);

    return [loading, result];
}
