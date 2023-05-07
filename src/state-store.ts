import { PlayerFrameInformation, PlayerTypes } from './types.js';

type PlayersData = {
    [key in PlayerTypes]: PlayerFrameInformation
}[]

export class StateStore {
    private _court: number[][] | null = null;
    private _videoTime: number | null = null;
    private _videoLength: number | null = null;
    private _players: PlayersData | null = null;
    private _fps: number | null = null;
    private _observerMap: Record<string, Function[]> = {};

    public registerObserver(property: string, observer: (value: unknown) => unknown) {
        if (!this._observerMap[property]) {
            this._observerMap[property] = [];
        }

        this._observerMap[property].push(observer);
    }

    get court(): number[][] | null {
        return this._court;
    }

    set court(value: number[][] | null) {
        this._court = value;
        this._notifyObservers('court', value);
    }

    get videoTime(): number | null {
        return this._videoTime
    }

    set videoTime(value: number | null) {
        this._videoTime = value;
        this._notifyObservers('videoTime', value);
    }

    get videoLength(): number | null {
        return this._videoLength
    }

    set videoLength(value: number | null) {
        this._videoLength = value;
        this._notifyObservers('videoLength', value);
    }

    get players(): PlayersData | null {
        return this._players
    }

    set players(value: PlayersData | null) {
        this._players = value;
        this._notifyObservers('players', value);
    }

    get fps(): number | null {
        return this._fps
    }

    set fps(value: number | null) {
        this._fps = value;
        this._notifyObservers('fps', value);
    }

    private _notifyObservers(property: string, value: unknown) {
        this._observerMap[property]?.forEach((observer) => {
            observer(value);
        });
    }
}
