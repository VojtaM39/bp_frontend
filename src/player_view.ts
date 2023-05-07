import { StateStore } from './state-store.js';
import { PlayerTypes } from './types.js';

export class PlayerViewHandler {
    private static readonly CROSS_OFFSET = 3;

    private _stateStore: StateStore;
    private _canvas: HTMLCanvasElement;

    constructor(stateStore: StateStore) {
        this._stateStore = stateStore;
        this._canvas = document.getElementById('court-view') as HTMLCanvasElement;
    }

    public registerEventHandlers() {
        this._stateStore.registerObserver('court', this._redrawCanvas.bind(this));
        this._stateStore.registerObserver('players', this._redrawCanvas.bind(this));
        this._stateStore.registerObserver('videoTime', this._redrawCanvas.bind(this));
    }

    private _redrawCanvas() {
        const context = this._canvas.getContext('2d');
        context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._drawPlayerPositions(context);
    }

    private _drawPlayerPositions(context: CanvasRenderingContext2D) {
        if (!this._stateStore.players || !this._stateStore.videoTime) {
            return;
        }

        const frame = Math.floor(this._stateStore.videoTime * this._stateStore.fps);
        const players = this._stateStore.players.slice(0, frame);

        const positions = players.flatMap((frameData) => {
            return [
                frameData[PlayerTypes.TOP].position,
                frameData[PlayerTypes.BOTTOM].position,
            ];
        });

        positions.forEach((position) => this._drawPlayerPosition(context, position));
    }

    private _drawPlayerPosition(context: CanvasRenderingContext2D, position: number[] | null) {
        if (!position) {
            return;
        }

        context.lineWidth = 1;
        context.strokeStyle = 'red';
        context.fillStyle = 'red';

        context.beginPath();

        context.moveTo(
            position[0] * this._canvas.width - PlayerViewHandler.CROSS_OFFSET,
            position[1] * this._canvas.height - PlayerViewHandler.CROSS_OFFSET
        );
        context.lineTo(
            position[0] * this._canvas.width + PlayerViewHandler.CROSS_OFFSET,
            position[1] * this._canvas.height + PlayerViewHandler.CROSS_OFFSET
        );

        context.moveTo(
            position[0] * this._canvas.width + PlayerViewHandler.CROSS_OFFSET,
            position[1] * this._canvas.height - PlayerViewHandler.CROSS_OFFSET
        );
        context.lineTo(
            position[0] * this._canvas.width - PlayerViewHandler.CROSS_OFFSET,
            position[1] * this._canvas.height + PlayerViewHandler.CROSS_OFFSET
        );

        context.closePath();
        context.stroke();
    }
}
