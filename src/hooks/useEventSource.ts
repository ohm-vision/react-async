import { DependencyList, useEffect, useRef, useState } from "react";

type MessageEventHandler<T = string> = (e: MessageEvent<T>) => any;

export type EventSourceProps = {
    url: string | URL;
} & EventSourceInit & EventSourceHandlers;

type EventSourceHandlers = {
    open?: (e: Event) => any;
    error?: (e: Event) => any;
} & Record<string, MessageEventHandler>;

export function useEventSource({
    url,
    withCredentials,
    ...handlers
}: EventSourceProps, deps: DependencyList) : MessageEvent[] {
    const [ events, setEvents ] = useState<MessageEvent[]>([]);

    const handlerRef = useRef<EventSourceHandlers>(handlers);

    useEffect(() => {
        const { current: { open, error, ...message } } = handlerRef;

        const messages = Object.entries(message).reduce<Record<string, (...args: any[]) => any>>((curr, [ key, value ]) => {
            curr[key] = ({ type, data: dataStr, lastEventId, ports, source, bubbles, cancelable, composed }: MessageEvent) => {
                let data: any;
                try {
                    data = JSON.parse(dataStr);
                }
                catch {
                    data = dataStr;
                }

                const event = new MessageEvent(type, {
                    data,
                    lastEventId,
                    origin,
                    ports: ports ? [...ports] : undefined,
                    source,
                    bubbles,
                    cancelable,
                    composed
                });

                onMessage(event);
            };

            return curr;
        }, {
            open: onOpen,
            error: onError
        });

        const source = new EventSource(url, {
            withCredentials
        });

        function onOpen(e: Event) {
            setEvents([]);

            if (open) {
                open(e);
            }
        }

        function onError(e: Event) {
            stopAndClose();

            if (error) {
                error(e);
            }
        }

        function onMessage(e: MessageEvent) {
            // append the event
            setEvents(events => [
                ...events,
                e
            ]);
        }

        function stopAndClose() {
            if (source.readyState !== EventSource.CLOSED) {
                source.close();
            }
        }

        return stopAndClose;
    }, [ url, withCredentials, handlerRef, ...deps ]);

    return events;
}
