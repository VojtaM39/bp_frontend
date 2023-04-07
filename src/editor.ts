
export class EditorHandler {
    private static readonly TIME_PICKER_STEPS = 100;

    private _video: HTMLVideoElement;
    private _timeSlider: HTMLInputElement;
    private _filePicker: HTMLInputElement
    private _recognizeCourtButton: HTMLButtonElement;
    private _matchVideo: HTMLVideoElement;
    private _playButton: HTMLButtonElement;
    private _currentTime: HTMLDivElement;

    constructor() {
        this._video = document.getElementById('match-video') as HTMLVideoElement;
        this._timeSlider = document.getElementById('time-slider') as HTMLInputElement;
        this._filePicker = document.getElementById('file-picker') as HTMLInputElement;
        this._recognizeCourtButton = document.getElementById('recognize-court') as HTMLButtonElement;
        this._playButton = document.getElementById('play-button') as HTMLButtonElement;
        this._matchVideo = document.getElementById('match-video') as HTMLVideoElement;
        this._currentTime = document.getElementById('current-time') as HTMLDivElement;
    }

    public registerEventHandlers() {
        this._handleVideoLoading();
        this._handleVideoControls();
        this._handleCourtRecognitionSubmit();
        this._handleTimeSliderUpdate();
    }

    private _handleVideoLoading() {
        this._filePicker.addEventListener('change', (event) => {
            const file = (event.target as HTMLInputElement).files[0];
            this._video.src = URL.createObjectURL(file);
        });
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
            const frame = this._getCurrentFrame();

            const response = await fetch('http://127.0.0.1:5000/recognize_court', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({ frame }),
            });
            const json = response.json();

            console.log(json);
            // FIXME
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

    private _handleTimeUpdate() {
        const seconds = Math.floor(this._video.currentTime) % 60;
        const minutes = Math.floor(this._video.currentTime / 60);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        this._timeSlider.value = Math.floor(this._video.currentTime / this._getProgressBarStepInSeconds()).toString();
        this._currentTime.innerText = formattedTime;
    };

    private _setPlayingButtonState() {
        this._playButton.setAttribute('data-state', 'playing');
    }

    private _setPausedButtonState() {
        this._playButton.setAttribute('data-state', 'pause');
    }

    private _getProgressBarStepInSeconds() {
        return this._video.duration / EditorHandler.TIME_PICKER_STEPS;
    }
}
