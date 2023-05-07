import { StateStore } from './state-store.js';
import { VideoPlayerHandler } from './video-player.js';
import { OverlayHandler } from './overlay.js';
import { PlayerViewHandler } from './player_view.js';

document.addEventListener("DOMContentLoaded", function(){
    const stateStore = new StateStore();

    const videoPlayerHandler = new VideoPlayerHandler(stateStore);
    const overlayHandler = new OverlayHandler(stateStore);
    const playerViewHandler = new PlayerViewHandler(stateStore);

    videoPlayerHandler.registerEventHandlers();
    overlayHandler.registerEventHandlers();
    playerViewHandler.registerEventHandlers();
});
