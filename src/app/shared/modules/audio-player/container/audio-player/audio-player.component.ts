import { Component, Input } from '@angular/core';
import {
  faPlay,
  faPause
} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent {
  playingAudio = false;
  totalDuration: number = 0;
  currentTime = 0;

  faPlay = faPlay
  faPause = faPause

  //audio = new Audio();
  audio: any;
  private _src: string = '';

  @Input() set src(value: string | undefined) {
    if (value) {
      this._src = value;

      this.audio = document.createElement('audio');
      const sourceElement = document.createElement('source');
      this.audio.appendChild(sourceElement);

      sourceElement.type = 'audio/mp3';

      /*console.log(`Play audio/mp3: ${this.audio.canPlayType('audio/mp3')}`);
      console.log(`Play audio/mp4: ${this.audio.canPlayType('audio/mp4')}`);
      console.log(`Play audio/wav: ${this.audio.canPlayType('audio/wav')}`);
      console.log(`Play video/mp4: ${this.audio.canPlayType('video/mp4')}`);
      console.log(`Play audio/mpeg: ${this.audio.canPlayType('audio/mpeg')}`);*/

      this.audio.src = value;
      this.audio.load();
      this.audio.addEventListener('durationchange', () => {
        if (!Number.isNaN(this.audio.duration) && this.audio.duration !== Infinity) {
          this.totalDuration = this.audio.duration;
        };
      });
      this.audio.addEventListener('ended', () => {
        this.playingAudio = false;
        this.currentTime = 0;
      });
      this.audio.addEventListener('timeupdate', () => {
        this.currentTime = this.audio.currentTime;
      });
    }
    
  }

  toggleListening() {
    this.playingAudio = !this.playingAudio;
    if (this.playingAudio) {
      this.play();
    }
    else {
      this.stop();
    }
  }

  play() {
    this.audio.play()
    .then(() => {});
  }

  stop() {
    this.audio.pause();
  }

  getCurrentTime() {
    return new Date(this.currentTime * 1000).toISOString().substring(14, 19);
  }

  getTotalDuration() {
    return new Date(this.totalDuration * 1000).toISOString().substring(14, 19);
  }

}
