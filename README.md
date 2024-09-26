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

#### Example
```ts
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
```ts
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

## Contact Me
[Ohm Vision, Inc](https://ohmvision.com)
