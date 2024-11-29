import { DependencyList, EffectCallback, useState } from "react";

import { useEffectAsync } from "./useEffectAsync";
import { AbortableSignal } from "@/types/abortable.signal";

/**
 * Wraps and creates a memo-like result using the `useState`
 * 
 * `useAsync` will only recompute the memoized value when one of the `deps` has changed
 * 
 * **Note**: Just like with the native `useMemo`, this will return the previous value until the calculation has changed
 * @param factory Asynchronous function to call
 * @param deps Dependency List
 * @param destructor Destructor
 * @returns [ `TResult | undefined` | `boolean` ]
 */
export function useAsync<TResult>(factory: (abortSignal: AbortableSignal) => Promise<TResult>, deps: DependencyList, destructor?: ReturnType<EffectCallback>) : [TResult | undefined, boolean] {
    const [ result, setResult ] = useState<TResult>(undefined);

    const loading = useEffectAsync(async (signal) => {
        const result = await factory(signal);

        signal.throwIfAborted();

        setResult(result);
    }, deps, destructor);

    return [result, loading];
}
