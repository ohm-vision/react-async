# useEffectAsync
Wrapper for react's useEffect to support asynchronous calls

[![npm version](https://badge.fury.io/js/@ohm-vision%2Fuseeffectasync.svg)](https://badge.fury.io/js/@ohm-vision%2Fuseeffectasync)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/1kom)

## Installation
Run the following command
```
npm install @ohm-vision/useeffectasync
```

## Usage
There are two effects depending on your needs

### useEffectAsync
This is the core async effect with nothing special

> **Important note:**
> 
> This method does not wrap anything in a try-catch block, error management is YOUR responsibility

#### Example
```tsx
import { useEffectAsync } from "@ohm-vision/useeffectasync"

export function MyAwesomeComponent(props) {
    const loading = useEffectAsync(async (signal: AbortSignal) => {
        // some special call

        // all processing is handled here - you manage everything

        // the AbortSignal will automatically be called when the component is unmounted
    }, [ props.dep1 ], () => {
        console.log("I was unloaded");
    });

}
```

### useFetch
This is an extension to the `useEffectAsync` which wraps the standard `fetch` call within an asynchronous operation

Used for loading data on the client

#### props (param 1)
This accepts all properties of the native `fetch` command and adds the following:
* `url`: `string | URL | RequestInfo` - endpoint to fetch
* `responseType`: `"raw" | "arrayBuffer" | "blob" | "formData" | "text" | "json"` - indicates how to process the successful response
  * When `raw` is used, the original `Response` object is returned
  * All other responses, will call the appropriate method to read the `body` and return a mutated response object

#### Example
```tsx
import { useFetch } from "@ohm-vision/useeffectasync"

export function MyAwesomeComponent(props) {
    const [ loading, { body }, error ] = useFetch({
        url: "https://example.com",
        responseType: "text",
    }, [ props.dep1 ], () => {
        console.log("I was unloaded");
    });

    // todo: do something with the body
}
```

### useMemoAsync/useMemoLoadingAsync
This is an extension to the `useEffectAsync` which attempts to operate similarly to React's native `useMemo` function

Used for firing asynchronous calls which return a result, could be a good alternative if you want to do something special.

I offer two variants:
1. `useMemoAsync` this acts the closest to the native `useMemo`. It returns the result or the previously computed result
2. `useMemoLoadingAsync` building off of needed results, this will instead return a Tuple indicating if loading is happening and the previously cached result. This is a good option if you want to show some loading or disable a component

> **Important note:**
> 
> This method does not wrap anything in a try-catch block, error management is YOUR responsibility

#### Example (useMemoAsync)
```tsx
import { useMemoAsync } from "@ohm-vision/useeffectasync"

export function MyAwesomeComponent(props) {
    const result = useMemoAsync(async (abortSignal: AbortSignal) => {
        // just in case we don't want to use the `useFetch`
        // ie. we have our own API classes, or are calling a third-party sdk
        const result = await fetch("http://example.com", {
            method: "GET"
        });

        return await result.json();
    }, [ props.dep1 ], () => {
        console.log("I was unloaded");
    });

    // todo: do something with the result
    // note: `result` will be undefined until the first load is complete
}
```

#### Example (useMemoLoadingAsync)
```tsx
import { useMemoLoadingAsync } from "@ohm-vision/useeffectasync"

export function MyAwesomeComponent(props) {
    const [ loading, result ] = useMemoLoadingAsync(async (abortSignal: AbortSignal) => {
        // just in case we don't want to use the `useFetch`
        // ie. we have our own API classes, or are calling a third-party sdk
        const result = await fetch("http://example.com", {
            method: "GET"
        });

        return await result.json();
    }, [ props.dep1 ], () => {
        console.log("I was unloaded");
    });

    if (loading) {
        // todo: show a skeleton component
        return <>Loading...</>;
    }

    // todo: do something with the result
    // note: `result` will be undefined until the first load is complete
}
```

## Contact Me
[Ohm Vision, Inc](https://ohmvision.com)
