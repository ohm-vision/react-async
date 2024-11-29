export type AbortableSignal = AbortSignal & {
    /**
     * This will immediately stop execution and throw an error
     * @param reason 
     */
    abort?: (reason: any) => void;
};