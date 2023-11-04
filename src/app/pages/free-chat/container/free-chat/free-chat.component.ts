import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  faPaperclip,
  faEllipsisV,
  faSearch,
  faMicrophone,
  faPaperPlane,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FreeChatMessage, FreeChatMessageOrigin, FreeChatMessageType } from '../../interfaces/free-chat-message';
import { FreeChatService } from '../../services/free-chat.service';
import { AudioRecorderService } from 'src/app/shared/modules/audio-recorder/services/audio-recorder.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DangerToastService } from 'src/app/shared/modules/toast/services/danger-toast/danger-toast.service';
import { Observable, from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FreeChat } from '../../interfaces/free-chat';

@Component({
  selector: 'app-free-chat',
  templateUrl: './free-chat.component.html',
  styleUrls: ['./free-chat.component.scss']
})
export class FreeChatComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  faPaperclip = faPaperclip
  faEllipsisV = faEllipsisV
  faSearch = faSearch
  faMicrophone = faMicrophone
  faTrash = faTrash
  faPaperPlane = faPaperPlane

  messages: FreeChatMessage[] = []
  message = ''

  showMobile = false;
  recordButtonLabel = 'Grabar audio';

  @ViewChild("chatBody") chatBody!: ElementRef;

  isRecording = false;
  recordedTime: any;

  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];

  blobUrl: string | undefined = undefined;
  blobAudio: Blob | undefined = undefined;

  voiceEnabled = false

  chatId: string | null = null;
  chat: FreeChat | undefined = undefined;
  chatEnded = false;

  constructor(
    private readonly _freeChatService: FreeChatService,
    private _audioRecorderService: AudioRecorderService,
    private domSanitizer: DomSanitizer,
    private readonly _dangerToastService: DangerToastService,
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
    this.recoverChat();
  }

  recoverChat() {
    this.chatId = this.route.snapshot.paramMap.get('id');
    if (!this.chatId) return;

    this._freeChatService.recoverChat(this.chatId).subscribe(
      chat => {
        this.chat = chat;
        if (this.chat.is_over) {
          this.chatEnded = true;
        }
        this.chat.messages.forEach(chatMessage => this.addMessage(chatMessage))
      },
      err => {
        this._dangerToastService.show('Ha habido un error al recuperar el chat');
        console.log(err);
      }
    )
  }

  endChat() {
    if (!this.chatId) return;
    this._freeChatService.endChat(this.chatId).subscribe(
      res => {
        // console.log("Received message: ", serverMessages);
        this.chatEnded = true;
      },
      err => {
        this._dangerToastService.show('Ha habido un error al finalizar el chat');
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

    if (!this.chatId) {
      // TODO add something
      this._dangerToastService.show('Ha habido un error al obtener el contexto de la conversación');
      console.error("There is no chatId");
      return;
    }

    const userMessage: FreeChatMessage = {
      message: this.message,
      type: FreeChatMessageType.TEXT
    };

    // console.log("Sent message: ", userMessage);

    if (this.voiceEnabled) {
      this._freeChatService.sendMessage(this.chatId, userMessage, true).subscribe(
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
      this._freeChatService.sendMessage(this.chatId, userMessage).subscribe(
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
    if (!this.chatId) {
      this._dangerToastService.show('Ha habido un error al obtener el contexto de la conversación');
      console.error("There is no chatId");
      return;
    }

    if (this.blobAudio) {
      // console.log("Sending audio..");
      this.blobToBase64(this.blobAudio).then(base64Audio => {
        
        const userMessage: FreeChatMessage = {
          message: base64Audio,
          type: FreeChatMessageType.SPEECH
        };

        // console.log(`Sent message: ${JSON.stringify(userMessage)}`);

        if (this.voiceEnabled) {
          this._freeChatService.sendMessage(this.chatId!, userMessage, true).subscribe(
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
          this._freeChatService.sendMessage(this.chatId!, userMessage).subscribe(
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

  addUserMessage(userMessage: FreeChatMessage) {
    userMessage.origin = FreeChatMessageOrigin.USER
    this.addMessage(userMessage);
  }

  addServerMessages(serverMessages: FreeChatMessage[]) {
    serverMessages.forEach(element => {
      this.addServerMessage(element);
    });
  }

  addServerMessage(serverMessage: FreeChatMessage) {
    serverMessage.origin = FreeChatMessageOrigin.AGENT
    this.addMessage(serverMessage);
  }

  addMessage(message: FreeChatMessage) {
    if (message.type == FreeChatMessageType.SPEECH) {
      message.message = this.getURLFromBlob(this.b64toBlob(message.message as string, 'audio/mp3'));
    }
    if (!message.origin) {
      if (message.sender_id) {
        message.origin = FreeChatMessageOrigin.USER;
      }
      else {
        message.origin = FreeChatMessageOrigin.AGENT;
      }
    }
    this.messages.push(message);
  }

  isTextConversation(message: FreeChatMessage) {
    return message.type == FreeChatMessageType.TEXT;
  }
  
  isAudioConversation(message: FreeChatMessage) {
    return message.type == FreeChatMessageType.SPEECH;
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
