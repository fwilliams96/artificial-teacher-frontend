import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PronunciationService } from '../../services/pronunciation.service';
import { DomSanitizer } from '@angular/platform-browser';
import { InfoToastService } from 'src/app/shared/modules/toast/services/info-toast/info-toast.service';
import { DangerToastService } from 'src/app/shared/modules/toast/services/danger-toast/danger-toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pronunciation } from '../../interfaces/pronunciation';
import { UserSpeech } from '../../interfaces/user-speech';
import { AudioRecorderService } from 'src/app/shared/modules/audio-recorder/services/audio-recorder.service';
import { faTrash, faMicrophone } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pronunciation',
  templateUrl: './pronunciation.component.html',
  styleUrls: ['./pronunciation.component.scss']
})
export class PronunciationComponent implements OnInit, AfterViewInit{

  faTrash = faTrash
  faMicrophone = faMicrophone

  serverAudioUrl: string | undefined = undefined;

  id_pronunciation: string | null = null;

  pronunciation: Pronunciation | undefined = undefined

  @ViewChild('audioPronunciation') audioPronunciation!: ElementRef;

  isRecording = false;
  recordedTime: any;

  userAudioUrl: string | undefined = undefined;
  userAudioBlob: Blob | undefined = undefined;

  recordLabel = 'Record';

  showMobile = false;
  recordButtonLabel = 'Grabar audio';

  constructor(
    private readonly _pronunciationService: PronunciationService,
    private _audioRecorderService: AudioRecorderService,
    private domSanitizer: DomSanitizer,
    private readonly _infoToastService: InfoToastService,
    private readonly _dangerToastService: DangerToastService,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const determineMobile = (e: any) => {
      if (e.matches) {
        this.showMobile = true;
      } else {
        this.showMobile = false;
      }
    }

    const laptopScreen = window.matchMedia('(max-width: 990px)');
    determineMobile(laptopScreen);

    laptopScreen.addEventListener('change', determineMobile);
  }

  ngAfterViewInit(): void {
    this.recoverPronunciation();

    this._audioRecorderService.recordingFailed().subscribe(() => {
      console.log("Recording failed");
      this.isRecording = false;
      this.stopRecording();
      this.userAudioBlob = undefined;
      this.userAudioUrl = undefined;
    });

    this._audioRecorderService.getRecordedTime().subscribe((time) => {
      // console.log(`Recorded time: ${time}`);
      this.recordedTime = time;
    });

    this._audioRecorderService.getRecordedBlob().subscribe((data) => {
      // console.log(`Recorded blob: ${data}`);
      this.userAudioBlob = data.blob;
      this.userAudioUrl = URL.createObjectURL(data.blob);
    });

  }

  recoverPronunciation() {
    this.id_pronunciation = this.route.snapshot.paramMap.get('id');
    if (!this.id_pronunciation) return;

    this._pronunciationService.getPronunciation(this.id_pronunciation).subscribe(
      pronunciation => {
        this.pronunciation = pronunciation;
        if (pronunciation.finished) {
          this.showUserAudio();
          this.showServerAudio();
        }
      },
      err => {
        this._dangerToastService.show('Ha habido un error al recuperar la pronunciación');
        console.log(err);
      }
    )
  }

  showUserAudio() {
    if (this.pronunciation && this.pronunciation.user_speech) {
      this.userAudioBlob = this.b64toBlob(this.pronunciation.user_speech.audio, 'audio/mp3');
      this.userAudioUrl = this.getURLFromBlob(this.userAudioBlob);
      /*if (this.audioPronunciation) {
        this.audioPronunciation.nativeElement.load();
      }*/
    }
  }

  showServerAudio() {
    if (this.pronunciation) {
      const blob = this.b64toBlob(this.pronunciation.sentence.audio, 'audio/mp3');
      this.serverAudioUrl = this.getURLFromBlob(blob);
      /*if (this.audioPronunciation) {
        this.audioPronunciation.nativeElement.load();
      }*/
    }
  }

  b64toBlob(b64Data: string, contentType: string): Blob {
	  const sliceSize = 512;
	  const byteCharacters = atob(b64Data);
	  const byteArrays = [];

	  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		const byteNumbers = new Array(slice.length);
	    for (let i = 0; i < slice.length; i++) {
	      byteNumbers[i] = slice.charCodeAt(i);
	    }

	    const byteArray = new Uint8Array(byteNumbers);
	    byteArrays.push(byteArray);
	  }

	  const blob = new Blob(byteArrays, {type: contentType});
	  return blob;
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  getURLFromBlob(blob: Blob): string {
    return URL.createObjectURL(blob)
  }

  toggleRecording() {
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      this.startRecording();
      this.recordButtonLabel = 'Parar audio';
    }
    else {
      this.stopRecording();
      this.recordButtonLabel = 'Grabar audio';
    }
  }

  startRecording() {
    console.log("Start recording");
    this.deleteRecording();

    this._audioRecorderService.startRecording();
    this.recordLabel = 'Stop';
  }

  deleteRecording() {
    this.userAudioBlob = undefined;
    this.userAudioUrl = undefined;
  }

  stopRecording() {
    console.log("Stop recording");
    /*this.mediaRecorder!.stream.getTracks().forEach( track => track.stop());
    this.mediaRecorder!.stop();*/
    this._audioRecorderService.stopRecording();
    this.recordLabel = 'Record';
  }

  checkPronunciation() {
    if (!this.id_pronunciation || !this.userAudioBlob) return;

    this.blobToBase64(this.userAudioBlob).then(base64Audio => {
      const user_speech: UserSpeech = {
        audio: base64Audio
      };
      this._pronunciationService.finishPronunciation(this.id_pronunciation!, user_speech).subscribe(
        res => {
          this.pronunciation = res;
          this.showServerAudio();
          if (this.isThereAnyError(this.pronunciation)) {
            this._infoToastService.show("Has tenido algunos errores de pronunciación, continua practicando");
          }
          else {
            this._infoToastService.show("No has tenido ningún error de pronunciación, ¡sigue así!");
          }
        },
        error => {
          console.log(error);
        }
      );
    });
    
  }

  isThereAnyError(pronunciation: Pronunciation) {
    const errors = pronunciation.sentence.words.filter((word) => word.is_word && word.wrong);
    return errors.length > 0;
  }

  finishPronunciation() {
    this._router.navigate(['/home']);
  }

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = this.arrayBufferToBase64(reader.result as ArrayBuffer);
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    // console.log(`Array buffer: ${JSON.stringify(buffer)}`)
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

}
