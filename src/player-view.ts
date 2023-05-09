/**
 * Bachelor thesis: Vojtech Maslan
 *
 * Class PlayerViewHandler is responsible for drawing the player positions on the court.
 */

import { StateStore } from './state-store.js';
import { PlayerTypes } from './types.js';

export class PlayerViewHandler {
    private static readonly CROSS_OFFSET = 3;
    private static readonly SIDELINE_OFFSET = 0.075;
    private static readonly BASELINE_OFFSET = 0.0568;
    private static readonly SERVICE_LINE_OFFSET = 0.3522;

    private _stateStore: StateStore;
    private _canvas: HTMLCanvasElement;

    constructor(stateStore: StateStore) {
        this._stateStore = stateStore;
        this._canvas = document.getElementById('court-view') as HTMLCanvasElement;
        this._redrawCanvas();
    }

    public registerEventHandlers() {
        this._stateStore.registerObserver('court', this._redrawCanvas.bind(this));
        this._stateStore.registerObserver('players', this._redrawCanvas.bind(this));
        this._stateStore.registerObserver('videoTime', this._redrawCanvas.bind(this));
    }

    private _redrawCanvas() {
        const context = this._canvas.getContext('2d');
        context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._drawLines(context);
        this._drawPlayerPositions(context);
    }

    private _drawLines(context: CanvasRenderingContext2D) {
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.fillStyle = 'black';

        context.beginPath();

        context.moveTo(0, 0.5 * this._canvas.height);
        context.lineTo(this._canvas.width, 0.5 * this._canvas.height);

        context.moveTo(PlayerViewHandler.SIDELINE_OFFSET * this._canvas.width, 0);
        context.lineTo(PlayerViewHandler.SIDELINE_OFFSET * this._canvas.width, this._canvas.height);

        context.moveTo((1 - PlayerViewHandler.SIDELINE_OFFSET) * this._canvas.width, 0);
        context.lineTo((1 - PlayerViewHandler.SIDELINE_OFFSET) * this._canvas.width, this._canvas.height);


        context.moveTo(0, PlayerViewHandler.BASELINE_OFFSET * this._canvas.height);
        context.lineTo(this._canvas.width, PlayerViewHandler.BASELINE_OFFSET * this._canvas.height);

        context.moveTo(0, (1 - PlayerViewHandler.BASELINE_OFFSET) * this._canvas.height);
        context.lineTo(this._canvas.width, (1 - PlayerViewHandler.BASELINE_OFFSET) * this._canvas.height);


        context.moveTo(0, PlayerViewHandler.SERVICE_LINE_OFFSET * this._canvas.height);
        context.lineTo(this._canvas.width, PlayerViewHandler.SERVICE_LINE_OFFSET * this._canvas.height);

        context.moveTo(0, (1 - PlayerViewHandler.SERVICE_LINE_OFFSET) * this._canvas.height);
        context.lineTo(this._canvas.width, (1 - PlayerViewHandler.SERVICE_LINE_OFFSET) * this._canvas.height);


        context.moveTo(0.5 * this._canvas.width, 0);
        context.lineTo(0.5 * this._canvas.width, PlayerViewHandler.SERVICE_LINE_OFFSET * this._canvas.height);

        context.moveTo(0.5 * this._canvas.width, this._canvas.height);
        context.lineTo(0.5 * this._canvas.width, (1 - PlayerViewHandler.SERVICE_LINE_OFFSET) * this._canvas.height);


        context.closePath();
        context.stroke();
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
