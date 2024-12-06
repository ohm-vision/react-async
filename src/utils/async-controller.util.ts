
export class AsyncController extends AbortController {
    constructor() {
        super();

        this.abort = this.abort.bind(this);
    }

    override abort(reason?: any): void {
        super.abort(reason);
        this.signal.throwIfAborted();
    }
}
