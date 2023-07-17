import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as RecordRTC from 'recordrtc';
import { Observable, Subject } from 'rxjs';

interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {

  private stream: MediaStream | undefined = undefined;
  private recorder: any;
  private interval: any;
  private startTime: any;
  private _recorded = new Subject<any>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<void>();

  constructor() { }


  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<void> {
    return this._recordingFailed.asObservable();
  }

  startRecording() {
    console.log(`Start recording service, recorder: ${this.recorder}`);
    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }
  
    this._recordingTime.next('00:00');
    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      this.stream = s;
      this.record(s);
    }).catch(error => {
      console.log(`Error starting recording: ${error}`);
      this._recordingFailed.next();
      // this._recordingFailed.next();
      // this._recordingFailed.error(error);
    });
  
  }

  private record(stream: MediaStream) {

    this.recorder = new RecordRTC.StereoAudioRecorder(stream, {
      type: 'audio'
    });
  
    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.numtoString(diffTime.minutes()) + ':' + this.numtoString(diffTime.seconds());
        this._recordingTime.next(time);
      },
      1000
    );
  }

  private numtoString(value: number) {
    let val = value.toString();
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  stopRecording() {
    console.log(`Stop recording service, recorder: ${this.recorder}`);
    if (this.recorder) {
      this.recorder.stop((blob: Blob) => {
        if (this.startTime) {
          const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
          this.stopMedia();
          this._recorded.next({ blob: blob, title: mp3Name });
        }
      }, () => {
        console.log('Error stopping recording');
        this.stopMedia();
        this._recordingFailed.next();
        // this._recordingFailed.complete();
        // this._recordingFailed.error(new Error('Error stopping recording'));
      });
    }
  
  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = undefined;
      clearInterval(this.interval);
      this.startTime = undefined;
      if (this.stream) {
        this.stream.getAudioTracks().forEach((track:MediaStreamTrack) => track.stop());
        this.stream = undefined;
      }
    }
  }

  abortRecording() {
    console.log("Abort recording service")
    this.stopMedia();
  }

}

