# react-async
Wrapper for react to support asynchronous calls

[![npm version](https://badge.fury.io/js/@ohm-vision%2Freact-async.svg)](https://badge.fury.io/js/@ohm-vision%2Freact-async)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/1kom)

## Installation
Run the following command
```
npm install @ohm-vision/react-async
```

## Usage
There are several effects offered depending on your needs

### useAsync
This is will likely be your best friend and the method you use the most.

It will fire your async function when a dependency has changed and return a Tuple indicating if the method is still loading

> **Important note:**
> 
> This method does not wrap anything in a try-catch block, error management is YOUR responsibility

#### Example
```tsx
import { useAsync } from "@ohm-vision/react-async"

export function MyAwesomeComponent(props) {
    const [ result, loading ] = useAsync(async (abortSignal: AbortSignal) => {
        // just in case we don't want to use the `useFetch`
        // ie. we have our own API classes, or are calling a third-party sdk
        const result = await fetch("http://example.com", {
            method: "GET",
            signal: abortSignal
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

### useEffectAsync
This is the core async effect with nothing special

> **Important note:**
> 
> This method does not wrap anything in a try-catch block, error management is YOUR responsibility

#### Example
```tsx
import { useEffectAsync } from "@ohm-vision/react-async"

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
This is an extension to the `useAsync` which wraps the standard `fetch` call using what I consider to be a good standard for handling the operation

Used for loading data on the client

> **Important note:**
> 
> Unlike other methods, this hook will capture the error response and return it to you as the third tuple (triple/triplet?)
> 
> This is done because unlike the other methods, there is less control over the function lifecycle when using this hook.

#### props (param 1)
This accepts all properties of the native `fetch` command and adds the following:
* `url`: `string | URL | RequestInfo` - endpoint to fetch
* `responseType`: `"raw" | "arrayBuffer" | "blob" | "formData" | "text" | "json"` - indicates how to process the successful response
  * When `raw` is used, the original `Response` object is returned
  * All other responses, will call the appropriate method to read the `body` and return a mutated response object

#### Example
```tsx
import { useFetch } from "@ohm-vision/react-async"

export function MyAwesomeComponent(props) {
    const [ loading, { body }, error ] = useFetch({
        url: "https://example.com",
        responseType: "text",
    }, [ props.dep1 ], () => {
        console.log("I was unloaded");
    });

    if (loading) {
        return <>Loading...</>
    }

    if (error) {
        return <>ERROR: {error.toString()}</>;
    }

    // todo: do something with the body
}
```

### useMemoAsync
This is an extension to the `useEffectAsync` which attempts to operate similarly to React's native `useMemo` function

Used for firing asynchronous calls which return a result, could be a good alternative if you want to do something special.

This method will just return the result or the previous value if an async call is still running

> **Important note:**
> 
> This method does not wrap anything in a try-catch block, error management is YOUR responsibility

#### Example
```tsx
import { useMemoAsync } from "@ohm-vision/react-async"

export function MyAwesomeComponent(props) {
    const result = useMemoAsync(async (abortSignal: AbortSignal) => {
        // just in case we don't want to use the `useFetch`
        // ie. we have our own API classes, or are calling a third-party sdk
        const result = await fetch("http://example.com", {
            method: "GET",
            signal: abortSignal
        });

        return await result.json();
    }, [ props.dep1 ], () => {
        console.log("I was unloaded");
    });

    // todo: do something with the result
    // note: `result` will be undefined until the first load is complete
}
```

## Contact Me
[Ohm Vision, Inc](https://ohmvision.com)
