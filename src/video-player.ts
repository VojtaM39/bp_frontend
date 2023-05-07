import { StateStore } from './state-store.js';

export class VideoPlayerHandler {
    private static readonly TIME_PICKER_STEPS = 100;

    private _stateStore: StateStore;
    private _video: HTMLVideoElement;
    private _timeSlider: HTMLInputElement;
    private _filePicker: HTMLInputElement
    private _recognizeCourtButton: HTMLButtonElement;
    private _videoAnalysisButton: HTMLButtonElement;
    private _matchVideo: HTMLVideoElement;
    private _playButton: HTMLButtonElement;
    private _currentTime: HTMLDivElement;

    constructor(stateStore: StateStore) {
        this._stateStore = stateStore;
        this._video = document.getElementById('match-video') as HTMLVideoElement;
        this._timeSlider = document.getElementById('time-slider') as HTMLInputElement;
        this._filePicker = document.getElementById('file-picker') as HTMLInputElement;
        this._recognizeCourtButton = document.getElementById('recognize-court') as HTMLButtonElement;
        this._videoAnalysisButton = document.getElementById('video-analysis') as HTMLButtonElement;
        this._playButton = document.getElementById('play-button') as HTMLButtonElement;
        this._matchVideo = document.getElementById('match-video') as HTMLVideoElement;
        this._currentTime = document.getElementById('current-time') as HTMLDivElement;
    }

    public registerEventHandlers() {
        this._handleVideoLoading();
        this._handleVideoMetadataUpdate();
        this._handleVideoControls();
        this._handleCourtRecognitionSubmit();
        this._handleVideoAnalysisSubmit();
        this._handleTimeSliderUpdate();
    }

    private _handleVideoLoading() {
        this._filePicker.addEventListener('change', (event) => {
            const file = (event.target as HTMLInputElement).files[0];
            this._video.src = URL.createObjectURL(file);
        });
    }

    private _handleVideoMetadataUpdate() {
        this._video.onloadedmetadata = () => {
            this._stateStore.videoLength = this._video.duration;
            this._stateStore.videoTime = 0;
        }
    }


    // https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Video_player_styling_basics
    private _handleVideoControls() {
        this._video.addEventListener('play', this._setPlayingButtonState.bind(this), false);
        this._video.addEventListener('pause', this._setPausedButtonState.bind(this), false);
        this._video.addEventListener('timeupdate', this._handleTimeUpdate.bind(this), false);

        const playButton = document.getElementById('play-button');
        playButton.addEventListener('click', async () => {
            if (this._video.paused) {
                await this._video.play();
            } else {
                await this._video.pause();
            }
        });
    };

    private _handleCourtRecognitionSubmit() {
        this._recognizeCourtButton.addEventListener('click', async () => {
            if (this._video.readyState !== 4) {
                return;
            }

            this._recognizeCourtButton.setAttribute('disabled', 'true');

            const frame = this._getCurrentFrame();

            const response = await fetch(this._getEndpointUrl('recognize_court'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ frame }),
            });
            const { court } = await response.json();
            this._stateStore.court = court;

            this._recognizeCourtButton.removeAttribute('disabled');
        });
    };

    private _handleVideoAnalysisSubmit() {
        this._videoAnalysisButton.addEventListener('click', async () => {
            if (this._video.readyState !== 4) {
                return;
            }

            this._videoAnalysisButton.setAttribute('disabled', 'true');

            const video = await this._getCurrentVideo();
            const court = this._stateStore.court;

            const response = await fetch(this._getEndpointUrl('analyze_video'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ video, court }),
            });

            const { players_data, fps } = await response.json();

            this._stateStore.players = players_data;
            this._stateStore.fps = fps;

            this._videoAnalysisButton.removeAttribute('disabled');
        });
    };

    private _handleTimeSliderUpdate() {
        this._timeSlider.addEventListener('input', () => {
            const seconds = parseInt(this._timeSlider.value) * this._getProgressBarStepInSeconds();

            this._video.pause();
            this._video.currentTime = seconds;
        });
    }

    private _getCurrentFrame() {
        const canvas = document.createElement("canvas");
        canvas.width = this._video.videoWidth;
        canvas.height = this._video.videoHeight;

        const canvasContext = canvas.getContext("2d");
        canvasContext.drawImage(this._video, 0, 0);

        return canvas.toDataURL('image/jpeg');
    };

    private async _getCurrentVideo() {
        const reader = new FileReader();
        reader.readAsDataURL(this._filePicker.files[0]);
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = (error) => {
                reject(`Error: ${error}`);
            };
        });
    }

    private _handleTimeUpdate() {
        const seconds = Math.floor(this._video.currentTime) % 60;
        const minutes = Math.floor(this._video.currentTime / 60);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        this._timeSlider.value = Math.floor(this._video.currentTime / this._getProgressBarStepInSeconds()).toString();
        this._currentTime.innerText = formattedTime;

        this._stateStore.videoTime = this._video.currentTime;
    };

    private _setPlayingButtonState() {
        this._playButton.setAttribute('data-state', 'playing');
    }

    private _setPausedButtonState() {
        this._playButton.setAttribute('data-state', 'pause');
    }

    private _getProgressBarStepInSeconds() {
        return this._video.duration / VideoPlayerHandler.TIME_PICKER_STEPS;
    }

    private _getEndpointUrl(endpoint) {
        // return `http://198.176.96.249:5000/${endpoint}`;
        return `${location.protocol}//${location.hostname}:5000/${endpoint}`;
    }
}
