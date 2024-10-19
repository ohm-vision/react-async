import { DependencyList, EffectCallback, useState } from "react";

import { useAsync } from "./useAsync";

type ResponseTypes = "raw" | "arrayBuffer" | "blob" | "formData" | "text" | "json";

type _Response = globalThis.Response;

type UseFetchProps<TResponseType extends ResponseTypes = ResponseTypes> = {
    url: string | URL | RequestInfo;
    /**
     * Indicates how to process the response
     */
    responseType: TResponseType;
} & Omit<RequestInit, "signal">;

type Response<TResponseType extends ResponseTypes> = TResponseType extends "raw" ? _Response :
    Omit<_Response, "bodyUsed" | "body" | "arrayBuffer" | "blob" | "formData" | "json" | "text" | "clone"> & {
        body: (
            TResponseType extends "json" ? Awaited<ReturnType<_Response["json"]>> :
            TResponseType extends "arrayBuffer" ? Awaited<ReturnType<_Response["arrayBuffer"]>> :
            TResponseType extends "blob" ? Awaited<ReturnType<_Response["blob"]>> :
            TResponseType extends "formData" ? Awaited<ReturnType<_Response["formData"]>> :
            TResponseType extends "text" ? Awaited<ReturnType<_Response["text"]>> : unknown
        );
    };

/**
 * Represents a core fetch request
 * @param param0 standard `fetch` props
 * @param deps Dependency list
 * @param destructor destructor
 * @returns [ loading, `Response`, Error ]
 */
export function useFetch<
    TResponseType extends ResponseTypes = ResponseTypes
    >(
    { url, responseType, ...init }: UseFetchProps<TResponseType>,
    deps: DependencyList,
    destructor?: ReturnType<EffectCallback>) : [ boolean, Response<TResponseType>, any ] {
    const [ error, setError ] = useState<any>();

    const [ loading, response ] = useAsync<Response<TResponseType>>(async (signal) => {
        let response = incompleteResponse(url, responseType);
        let error = null;

        try {
            const originalResponse = await fetch(url, {
                ...init,
                signal
            });

            // short-circuit to prevent further processing
            if (signal.aborted) {
                return;
            }

            if (responseType === "raw" || !response.ok) {
                // pass-through: no further processing
                response = originalResponse as any;
            } else {
                let body: any = null;
                switch (responseType) {
                    case "arrayBuffer":
                        body = await originalResponse.arrayBuffer();
                        break;
                    case "blob":
                        body = await originalResponse.blob();
                        break;
                    case "formData":
                        body = await originalResponse.formData();
                        break;
                    case "text":
                        body = await originalResponse.text();
                        break;
                    case "json":
                        body = await originalResponse.json();
                        break;
                }

                response = {
                    ok: originalResponse.ok,
                    headers: originalResponse.headers,
                    redirected: originalResponse.redirected,
                    status: originalResponse.status,
                    statusText: originalResponse.statusText,
                    type: originalResponse.type,
                    url: originalResponse.url,
                    body: body
                } as Response<TResponseType>;
            }
        }
        catch (e) {
            // only capture the error if it is not a result of a cancellation
            if (signal.aborted) {
                return;
            }

            error = e;
        } finally {
            setError(error);

            return response;
        }
    }, deps, destructor);

    if (loading) {
        return [ loading, incompleteResponse(url, responseType), null ];
    }

    return [ loading, response, error ];
}

/**
 * Generates a fake response object to prevent null exceptions on initial deconstruction
 * @param url 
 * @param responseType 
 * @returns 
 */
function incompleteResponse<
    TResponseType extends ResponseTypes = ResponseTypes
    >(url: string | URL | RequestInfo, responseType: TResponseType): Response<TResponseType> {

    const res: any = {
        headers: new Headers(),
        ok: false,
        redirected: false,
        status: 0,
        statusText: "LOADING",
        type: "default",
        url: toUrlString(url),
        body: null,
    } as Response<TResponseType>;

    if (responseType === "raw") {
        return {
            ...res,
            bodyUsed: false,
            arrayBuffer: noopAsync,
            blob: noopAsync,
            formData: noopAsync,
            json: noopAsync,
            text: noopAsync,
            clone: () => incompleteResponse(url, responseType) as _Response,
        } satisfies _Response as any;
    }

    return res;
}

function noopAsync(): any {
    return Promise.resolve();
}

function toUrlString(url: string | URL | RequestInfo) {
    if (url instanceof URL) {
        return url.toString();
    } else if (url instanceof Request) {
        return url.url;
    } else {
        return url;
    }
}