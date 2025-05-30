import { DependencyList, EffectCallback, useEffect, useState } from "react";

/**
 * Basic wrapper to support an asynchronous call
 * @param effect asynchronous effect
 * @param deps Dependency List
 * @param destructor Destructor
 * @returns `true` if the effect is still running, or `false` once the effect completes
 */
export function useEffectAsync(effect: (signal: AbortController) => Promise<void>, deps: DependencyList, destructor?: ReturnType<EffectCallback>): boolean {
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        // reset the loading state
        setLoading(true);

        //- create an abort controller where 
        const ctrl = new AbortController();

        const _abort = ctrl.abort.bind(ctrl);

        ctrl.abort = function abort(reason?: any) {
            _abort(reason);
            this.signal.throwIfAborted();
        }

        // fire effect
        effect(ctrl)
            .catch(e => {
                if (ctrl.signal.aborted) {
                    console.debug("[useEffectAsync] - signal aborted", ctrl.signal.reason);
                    return;
                }

                throw e;
            })
            .finally(() => setLoading(false));

        return () => {
            // signal abort
            _abort("deps");

            // fire deconstructor
            if (typeof destructor === "function") {
                destructor();
            }
        };
    }, deps);

    return loading;
}
