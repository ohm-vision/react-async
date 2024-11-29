import { AbortableSignal } from "@/types/abortable.signal";
import { DependencyList, EffectCallback, useEffect, useState } from "react";

/**
 * Basic wrapper to support an asynchronous call
 * @param effect asynchronous effect
 * @param deps Dependency List
 * @param destructor Destructor
 * @returns `true` if the effect is still running, or `false` once the effect completes
 */
export function useEffectAsync(effect: (signal: AbortableSignal) => Promise<void>, deps: DependencyList, destructor?: ReturnType<EffectCallback>): boolean {
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        // reset the loading state
        setLoading(true);

        const controller = new AbortController();

        function abort(reason: any) {
            controller.abort(reason);
            controller.signal.throwIfAborted();
        }

        const signal: AbortableSignal = controller.signal;
        signal.abort = abort;

        // fire effect
        effect(controller.signal)
            .catch(e => {
                if (signal.aborted) {
                    console.trace("[useEffectAsync] - signal aborted", signal.reason, e);
                    return;
                }

                throw e;
            })
            .finally(() => setLoading(false));

        return () => {
            // signal abort
            controller.abort("deps");

            // fire deconstructor
            if (typeof destructor === "function") {
                destructor();
            }
        };
    }, deps);

    return loading;
}
