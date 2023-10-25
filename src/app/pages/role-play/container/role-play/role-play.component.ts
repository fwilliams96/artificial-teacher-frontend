import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {
  faPaperclip,
  faEllipsisV,
  faSearch,
  faMicrophone,
  faPaperPlane,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { AudioRecorderService } from 'src/app/shared/modules/audio-recorder/services/audio-recorder.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DangerToastService } from 'src/app/shared/modules/toast/services/danger-toast/danger-toast.service';
import { Observable, from } from 'rxjs';
import { RolePlayMessage, RolePlayMessageOrigin, RolePlayMessageType } from '../../interfaces/role-play-message';
import { RolePlayService } from '../../services/role-play.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RolePlay } from '../../interfaces/role-play';
import { InfoToastService } from 'src/app/shared/modules/toast/services/info-toast/info-toast.service';

@Component({
  selector: 'app-role-play',
  templateUrl: './role-play.component.html',
  styleUrls: ['./role-play.component.scss']
})
export class RolePlayComponent implements AfterViewChecked, OnDestroy, AfterViewInit {

  faPaperclip = faPaperclip
  faEllipsisV = faEllipsisV
  faSearch = faSearch
  faMicrophone = faMicrophone
  faTrash = faTrash
  faPaperPlane = faPaperPlane

  messages: RolePlayMessage[] = []
  message = ''

  @ViewChild("chatBody") chatBody!: ElementRef;

  isRecording = false;
  recordedTime: any;

  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];

  blobUrl: string | undefined = undefined;
  blobAudio: Blob | undefined = undefined;

  voiceEnabled = false

  rolePlayId: string | null = null;
  rolePlay: RolePlay | undefined = undefined;
  rolePlayEnded = false;

  constructor(
    private readonly _rolePlayService: RolePlayService,
    private _audioRecorderService: AudioRecorderService,
    private domSanitizer: DomSanitizer,
    private readonly _dangerToastService: DangerToastService,
    private readonly _infoToastService: InfoToastService,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.recoverRolePlay();
  }

  recoverRolePlay() {
    this.rolePlayId = this.route.snapshot.paramMap.get('id');
    if (!this.rolePlayId) return;

    this._rolePlayService.recoverRolePlay(this.rolePlayId).subscribe(
      rolePlay => {
        this.rolePlay = rolePlay;
        if (rolePlay.is_over) {
          this.rolePlayEnded = true;
        }
        this.rolePlay.messages.forEach(rolePlayMessage => this.addMessage(rolePlayMessage))
      },
      err => {
        this._dangerToastService.show('Ha habido un error al recuperar el role play');
        console.log(err);
      }
    )
  }

  ngAfterViewChecked() {
    this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;

    this._audioRecorderService.recordingFailed().subscribe(() => {
      console.log("Recording failed");
      this.isRecording = false;
      this.stopRecording();
    });

    this._audioRecorderService.getRecordedTime().subscribe((time) => {
      // console.log(`Recorded time: ${time}`);
      this.recordedTime = time;
    });

    this._audioRecorderService.getRecordedBlob().subscribe((data) => {
      // console.log(`Recorded blob: ${data}`);
      this.blobAudio = data.blob;
      this.blobUrl = URL.createObjectURL(data.blob);
    });
  }

  onKeyDown(event: Event) {
    event.preventDefault();
  }
  
  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
  }

  sendText() {
    // console.log(this.message)

    if (!this.rolePlayId) {
      // TODO add something
      this._dangerToastService.show('Ha habido un error al obtener el id del role play');
      console.error("There is no contextId");
      return;
    }

    const userMessage: RolePlayMessage = {
      message: this.message,
      type: RolePlayMessageType.TEXT
    };

    // console.log("Sent message: ", userMessage);

    if (this.voiceEnabled) {
      this._rolePlayService.sendMessage(this.rolePlayId, userMessage, true).subscribe(
        serverMessages => {
          // console.log("Received message: ", serverMessages);

          this.addUserMessage(userMessage);
          serverMessages.forEach(serverMessage => this.addServerMessage(serverMessage));
          this.message = '';
        },
        err => {
          this._dangerToastService.show('Ha habido un error al enviar el mensaje');
          console.log(err);
        }
      )
    }
    else {
      this._rolePlayService.sendMessage(this.rolePlayId, userMessage).subscribe(
        serverMessages => {
          // console.log("Received messages: ", serverMessages);
  
          this.addUserMessage(userMessage);
          serverMessages.forEach(serverMessage => this.addServerMessage(serverMessage));
  
          this.message = '';
        },
        err => {
          this._dangerToastService.show('Ha habido un error al enviar el mensaje');
          console.log(err)
        }
      );
    }

  }

  getURLFromBlob(blob: Blob): string {
    return URL.createObjectURL(blob)
  }

  sendRecording() {
    if (!this.rolePlayId) {
      this._dangerToastService.show('Ha habido un error al obtener el id del role play');
      console.error("There is no contextId");
      return;
    }

    if (this.blobAudio) {
      // console.log("Sending audio..");
      this.blobToBase64(this.blobAudio).then(base64Audio => {
        
        const userMessage: RolePlayMessage = {
          message: base64Audio,
          type: RolePlayMessageType.SPEECH
        };

        // console.log(`Sent message: ${JSON.stringify(userMessage)}`);

        if (this.voiceEnabled) {
          this._rolePlayService.sendMessage(this.rolePlayId!, userMessage, true).subscribe(
            serverMessages => {
              // console.log("Received messages: ", serverMessages);
      
              this.addUserMessage(userMessage);
              serverMessages.forEach(serverMessage => this.addServerMessage(serverMessage));
      
              this.message = '';
              this.deleteRecording();
            },
            err => {
              this._dangerToastService.show('Ha habido un error al enviar el mensaje de voz');
              console.log(`Error sending audio: ${err}`);
              console.log(`Error sending audio json: ${JSON.stringify(err)}`);
            }
          )
        }
        else {
          this._rolePlayService.sendMessage(this.rolePlayId!, userMessage).subscribe(
            serverMessages => {
              // console.log("Received messages: ", serverMessages);
      
              this.addUserMessage(userMessage);
              serverMessages.forEach(serverMessage => this.addServerMessage(serverMessage));
      
              this.message = '';
              this.deleteRecording();
            },
            err => {
              console.log(`Error sending audio: ${err}`);
              console.log(`Error sending audio json: ${JSON.stringify(err)}`);
              this._dangerToastService.show('Ha habido un error al enviar el mensaje de voz');
            }
          )
        }
      })
      .catch((err) => {
        console.log(`blobToBase64 error: ${JSON.stringify(err)}`)
        console.log(err);
      });
    }
  }

  addUserMessage(userMessage: RolePlayMessage) {
    userMessage.origin = RolePlayMessageOrigin.USER
    this.addMessage(userMessage);
  }

  addServerMessages(serverMessages: RolePlayMessage[]) {
    serverMessages.forEach(element => {
      this.addServerMessage(element);
    });
  }

  addServerMessage(serverMessage: RolePlayMessage) {
    serverMessage.origin = RolePlayMessageOrigin.AGENT
    this.addMessage(serverMessage);
  }

  addMessage(message: RolePlayMessage) {
    if (message.type == RolePlayMessageType.SPEECH) {
      message.message = this.getURLFromBlob(this.b64toBlob(message.message as string, 'audio/mp3'));
    }
    if (!message.origin) {
      if (message.sender_id) {
        message.origin = RolePlayMessageOrigin.USER;
      }
      else {
        message.origin = RolePlayMessageOrigin.AGENT;
      }
    }
    if (message.last_message) {
      this.rolePlayEnded = true;
      this._infoToastService.show("El role play ha finalizado, ¡gran trabajo!");
    }
    this.messages.push(message);
  }

  isTextConversation(message: RolePlayMessage) {
    return message.type == RolePlayMessageType.TEXT;
  }
  
  isAudioConversation(message: RolePlayMessage) {
    return message.type == RolePlayMessageType.SPEECH;
  }

  toggleRecording() {
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      this.startRecording();
    }
    else {
      this.stopRecording();
    }
  }

  startRecording() {
    console.log("Start recording");
    this.deleteRecording();

    this._audioRecorderService.startRecording();
  }

  getMedia(constraints: MediaStreamConstraints): Observable<any> {
      return from(navigator.mediaDevices.getUserMedia(constraints))
  }
  
  stopRecording() {
    console.log("Stop recording");
    /*this.mediaRecorder!.stream.getTracks().forEach( track => track.stop());
    this.mediaRecorder!.stop();*/
    this._audioRecorderService.stopRecording();
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  deleteRecording() {
    this.blobAudio = undefined;
    this.blobUrl = undefined;
    this.audioChunks = [];
  }

  abortRecording() {
    console.log("Abort recording")
    if (this.isRecording) {
      this.isRecording = false;
      this._audioRecorderService.abortRecording();
    }
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

  b64toBlob(b64Data: string, contentType: string) {
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
