import { DependencyList, EffectCallback, useEffect, useState } from "react";

/**
 * Basic wrapper to support an asynchronous call
 * @param effect asynchronous effect
 * @param deps Dependency List
 * @param destructor Destructor
 * @returns `true` if the effect is still running, or `false` once the effect completes
 */
export function useEffectAsync(effect: (signal: AbortSignal) => Promise<void>, deps: DependencyList, destructor?: ReturnType<EffectCallback>): boolean {
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        // reset the loading state
        setLoading(true);

        const controller = new AbortController();

        // fire effect
        effect(controller.signal)
            .finally(() => setLoading(false));

        return () => {
            // signal abort
            controller.abort();

            // fire deconstructor
            if (typeof destructor === "function") {
                destructor();
            }
        };
    }, deps);

    return loading;
}
