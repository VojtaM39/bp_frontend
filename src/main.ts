import { StateStore } from './state-store.js';
import { VideoPlayerHandler } from './video-player.js';
import { OverlayHandler } from './overlay.js';

document.addEventListener("DOMContentLoaded", function(){
    const stateStore = new StateStore();

    const videoPlayerHandler = new VideoPlayerHandler(stateStore);
    const overlayHandler = new OverlayHandler(stateStore);

    videoPlayerHandler.registerEventHandlers();
    overlayHandler.registerEventHandlers();
});
