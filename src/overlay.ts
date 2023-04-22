import { StateStore } from './state-store.js';
import { PlayerTypes } from './types.js';

export class OverlayHandler {
    private static readonly PLAYER_EDGES = [
        [0, 1],

        [1, 2],
        [2, 3],
        [3, 4],

        [1, 5],
        [5, 6],
        [6, 7],

        [1, 8],

        [8, 9],
        [9, 10],
        [10, 11],

        [8, 12],
        [12, 13],
        [13, 14],
    ];

    private _stateStore: StateStore;
    private _canvas: HTMLCanvasElement;

    constructor(stateStore: StateStore) {
        this._stateStore = stateStore;
        this._canvas = document.getElementById('match-overlay') as HTMLCanvasElement;
    }

    public registerEventHandlers() {
        this._stateStore.registerObserver('court', this._redrawCanvas.bind(this));
        this._stateStore.registerObserver('players', this._redrawCanvas.bind(this));
    }

    private _redrawCanvas() {
        const context = this._canvas.getContext('2d');
        context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._drawCourt(context);
        this._drawPlayers(context);
    }

    private _drawCourt(context: CanvasRenderingContext2D) {
        const court = this._stateStore.court;

        context.strokeStyle = 'red';
        context.beginPath();

        context.moveTo(court[0][0] * this._canvas.width, court[0][1] * this._canvas.height);
        context.lineTo(court[1][0] * this._canvas.width, court[1][1] * this._canvas.height);
        context.lineTo(court[3][0] * this._canvas.width, court[3][1] * this._canvas.height);
        context.lineTo(court[2][0] * this._canvas.width, court[2][1] * this._canvas.height);

        context.closePath();
        context.stroke();
    }

    private _drawPlayers(context: CanvasRenderingContext2D) {
        if (this._stateStore.videoTime === null) {
            return;
        }

        if (this._stateStore.videoLength === null) {
            return;
        }

        if (this._stateStore.players === null) {
            return;
        }

        const frame = Math.floor(this._stateStore.videoTime / this._stateStore.videoLength);

        console.log(this._stateStore);
        this._drawPlayer(context, this._stateStore.players[PlayerTypes.TOP]?.[frame]);
        this._drawPlayer(context, this._stateStore.players[PlayerTypes.BOTTOM]?.[frame]);
    }

    private _drawPlayer(context: CanvasRenderingContext2D, player?: number[][]) {
        if (!player) {
            return;
        }

        context.strokeStyle = 'blue';

        for (const edge of OverlayHandler.PLAYER_EDGES) {
            const point1 = player[edge[0]];
            const point2 = player[edge[1]];

            if (!point1 || !point2) {
                continue;
            }

            context.beginPath();

            context.moveTo(point1[0] * this._canvas.width, point1[1] * this._canvas.height);
            context.lineTo(point2[0] * this._canvas.width, point2[1] * this._canvas.height);

            context.closePath();
            context.stroke();
        }
    }
}
