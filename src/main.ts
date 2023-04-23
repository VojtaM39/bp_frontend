import { StateStore } from './state-store.js';
import { VideoPlayerHandler } from './video-player.js';
import { OverlayHandler } from './overlay.js';
import { PlayerTypes, StrokeTypes } from './types.js';

document.addEventListener("DOMContentLoaded", function(){
    const stateStore = new StateStore();
    stateStore.players = {
        [PlayerTypes.BOTTOM]: [
            {
                skeleton: [
                    [0.5, 0.5],
                    [0.5, 0.55],

                    [0.45, 0.55],
                    [0.45, 0.57],
                    [0.45, 0.59],

                    [0.55, 0.55],
                    [0.55, 0.57],
                    [0.55, 0.59],

                    [0.5, 0.6],

                    [0.45, 0.62],
                    [0.45, 0.65],
                    [0.45, 0.69],

                    [0.55, 0.62],
                    [0.55, 0.65],
                    [0.55, 0.69],
                ],
                position: [0.5, 0.85],
                stroke: StrokeTypes.BOTTOM,
            }
        ],
        [PlayerTypes.TOP]: null,
    };

    const videoPlayerHandler = new VideoPlayerHandler(stateStore);
    const overlayHandler = new OverlayHandler(stateStore);

    videoPlayerHandler.registerEventHandlers();
    overlayHandler.registerEventHandlers();
});
