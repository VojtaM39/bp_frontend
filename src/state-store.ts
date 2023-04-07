class StateStore {
    private _filename: string | null = null;
    private _observerMap: Record<string, Function[]> = {};

    public registerObserver(property: string, observer: (value: unknown) => unknown) {
        if (!this._observerMap[property]) {
            this._observerMap[property] = [];
        }

        this._observerMap[property].push(observer);
    }

    get filename(): string | null {
        return this._filename;
    }

    set filename(value: string | null) {
        this._filename = value;

        this._observerMap['_filename'].forEach((observer) => {
            observer(value);
        });
    }
}

const stateStore = new StateStore();
export default  stateStore;
