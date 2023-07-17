import { AfterViewChecked, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {
  faPaperclip,
  faEllipsisV,
  faSearch,
  faMicrophone,
  faPaperPlane,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { Message, MessageOrigin } from '../../interfaces/message';
import { Observable, from, last } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChatService } from '../../services/chat/chat.service';
import { ServerContext } from '../../interfaces/server-context';
import { DangerToastService } from 'src/app/shared/modules/toast/services/danger-toast/danger-toast.service';
import { UserMessage } from '../../interfaces/user-message';
import { Activity } from '../../interfaces/activity';
import { MessageType } from '../../interfaces/message-type';
import { ServerMessage } from '../../interfaces/server-message';
import { ContentType } from '../../interfaces/content-type';
import * as RecordRTC from 'recordrtc';
import { AudioRecorderService } from 'src/app/shared/modules/audio-recorder/services/audio-recorder.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewChecked, OnDestroy {

  faPaperclip = faPaperclip
  faEllipsisV = faEllipsisV
  faSearch = faSearch
  faMicrophone = faMicrophone
  faTrash = faTrash
  faPaperPlane = faPaperPlane

  messages: Message[] = []
  message = ''
  contextId: string | undefined = undefined

  @ViewChild("chatBody") chatBody!: ElementRef;

  isRecording = false;
  recordedTime: any;

  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];

  blobUrl: string | undefined = undefined;
  blobAudio: Blob | undefined = undefined;

  voiceEnabled = false

  activityRunning = false

  constructor(
    private readonly _chatService: ChatService,
    private _audioRecorderService: AudioRecorderService,
    private domSanitizer: DomSanitizer,
    private readonly _dangerToastService: DangerToastService
  ) {}

  ngAfterViewChecked() {
    this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;

    this._audioRecorderService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this._audioRecorderService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this._audioRecorderService.getRecordedBlob().subscribe((data) => {
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

  startConversation() {

    const userMessage: UserMessage = {
      content: "Hello",
      content_type: ContentType.TEXT,
      message_type: MessageType.CONVERSATION
    }

    this._chatService.startConversation(userMessage).subscribe(
      serverContext => {
        this.contextId = serverContext.context_id;
        this.addServerContextMessage(serverContext);
      },
      err => {
        this._dangerToastService.show('Ha habido un error al empezar la conversación');
        console.log(err);
      }
    )
  }

  sendText() {
    // console.log(this.message)

    if (!this.contextId) {
      // TODO add something
      this._dangerToastService.show('Ha habido un error al obtener el contexto de la conversación');
      console.error("There is no contextId");
      return;
    }

    const userMessage: UserMessage = {
      content: this.message,
      content_type: ContentType.TEXT,
      message_type: MessageType.CONVERSATION
    }

    // console.log("Sent message: ", userMessage);

    if (this.voiceEnabled) {
      this._chatService.sendMessage(this.contextId, userMessage, ContentType.AUDIO).subscribe(
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
      this._chatService.sendMessage(this.contextId, userMessage).subscribe(
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

  instanceOfActivity(content: any): content is Activity {
      return 'name' in content;
  }

  getURLFromBlob(blob: Blob): string {
    return URL.createObjectURL(blob)
  }

  sendRecording() {
    if (!this.contextId) {
      this._dangerToastService.show('Ha habido un error al obtener el contexto de la conversación');
      console.error("There is no contextId");
      return;
    }

    if (this.blobAudio) {
      // console.log("Sending audio..");
      this.blobToBase64(this.blobAudio).then(base64Audio => {
        
        const userMessage: UserMessage = {
          content: base64Audio,
          content_type: ContentType.AUDIO,
          message_type: MessageType.CONVERSATION
        };

        // console.log(`Sent message: ${JSON.stringify(userMessage)}`);

        if (this.voiceEnabled) {
          this._chatService.sendMessage(this.contextId!, userMessage, ContentType.AUDIO).subscribe(
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
          this._chatService.sendMessage(this.contextId!, userMessage).subscribe(
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

  addUserMessage(userMessage: UserMessage) {
    if (userMessage.content_type == ContentType.AUDIO) {
      this.messages.push({
        type: MessageOrigin.User,
        content_type: userMessage.content_type,
        content: this.getURLFromBlob(this.b64toBlob(userMessage.content as string, 'audio/mp3')),
        message_type: MessageType.CONVERSATION
      })
    }
    else {
      this.messages.push({
        type: MessageOrigin.User,
        content_type: userMessage.content_type,
        content: userMessage.content,
        message_type: MessageType.CONVERSATION
      });
    }
  }

  addServerContextMessage(serverContextMessage: ServerContext) {
    this.messages.push({
      type: MessageOrigin.Server,
      content_type: ContentType.TEXT,
      content: serverContextMessage.content,
      message_type: MessageType.CONVERSATION,
    });
  }

  addServerMessage(serverMessage: ServerMessage) {
    if (serverMessage.message_type == MessageType.ACTIVITY) {
      this.activityRunning = true;
    }
    if (serverMessage.content_type == ContentType.AUDIO) {
      this.messages.push({
        type: MessageOrigin.Server,
        content_type: serverMessage.content_type,
        content: this.getURLFromBlob(this.b64toBlob(serverMessage.content as string, 'audio/mp3')),
        message_type: serverMessage.message_type
      })
    }
    else {
      this.messages.push({
        type: MessageOrigin.Server,
        content_type: serverMessage.content_type,
        content: serverMessage.content,
        message_type: serverMessage.message_type
      });
    }
    // console.log("Received server messages", this.messages);
    
  }

  isTextConversation(message: Message) {
    return message.content_type == ContentType.TEXT &&
    message.message_type == MessageType.CONVERSATION
  }
  
  isAudioConversation(message: Message) {
    return message.content_type == ContentType.AUDIO &&
    message.message_type == MessageType.CONVERSATION
  }

  isTextActivity(message: Message) {
    return message.content_type == ContentType.TEXT &&
    message.message_type == MessageType.ACTIVITY
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
    this.deleteRecording();

    this._audioRecorderService.startRecording();

    /*this.getMedia({audio: true}).subscribe(
      res => {
        const mime = [
          'audio/wav', 
          'audio/mpeg', 
          'audio/webm', 
          'audio/webm;codecs=vp8', 
          'audio/webm;codecs=opus', 
          'video/webm;codecs=vp9', 
          'audio/ogg', 
          'audio/mp4',
          'audio/mp3'
        ]
        .filter(MediaRecorder.isTypeSupported);
        let mimeType = '';
        console.log(`mime types supported: ${mime}`);
        if (MediaRecorder.isTypeSupported('audio/mp3')) {
          console.log('audio/mp3 supported');
          mimeType = 'audio/mp3';
        }
        else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          console.log('audio/mp4 supported');
          mimeType = 'audio/mp4';
        }
        else if (MediaRecorder.isTypeSupported('audio/webm')) {
          console.log('audio/webm supported');
          mimeType = 'audio/webm';
        }
        else {
          console.log('either audio/mp4 nor audio/webm are supported, setting audio/wav');
          mimeType = 'audio/wav';
        }

        console.log(`mime type supported: ${mimeType}`);
        this.mediaRecorder = new MediaRecorder(res, { mimeType: 'audio/mp3' });

        this.mediaRecorder.addEventListener("dataavailable", (event) => {
          // console.log(`Chunk event: ${JSON.stringify(event)}`);
          // console.log(`Chunk event data: ${JSON.stringify(event)}`);
          this.audioChunks.push(event.data);
        });

        this.mediaRecorder.addEventListener("stop", async () => {
          this.audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType });
          console.log(`blob mime: ${this.mediaRecorder?.mimeType}`);

          // console.log(`Audio blob: ${JSON.stringify(this.audioBlob)}`);
          this.url = URL.createObjectURL(this.audioBlob)
          console.log(`URL blob: ${JSON.stringify(this.url)}`);
        });

        this.mediaRecorder.start();

      },
      err => {
        console.log(err);
      }
    )*/
  }

  getMedia(constraints: MediaStreamConstraints): Observable<any> {
      return from(navigator.mediaDevices.getUserMedia(constraints))
  }
  
  stopRecording() {
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

  answerActivity(option: string) {
    if (!this.contextId) {
      // TODO add something
      this._dangerToastService.show('Ha habido un error al obtener el contexto de la conversación');
      console.error("There is no contextId");
      return;
    }

    const userMessage: UserMessage = {
      content: option,
      content_type: ContentType.TEXT,
      message_type: MessageType.ACTIVITY
    }

    // console.log("Sent message: ", userMessage);

    this._chatService.sendMessage(this.contextId, userMessage).subscribe(
      serverMessages => {
        // console.log("Received messages: ", serverMessages);
        this.disableLastServerActivity();
        serverMessages.forEach(serverMessage => this.addServerMessage(serverMessage));
        this.activityRunning = false;
      },
      err => {
        this._dangerToastService.show('Ha habido un error al enviar el mensaje');
        console.log(err)
      }
    );
  }

  disableLastServerActivity() {
    const lastServerActivityMessage = this.messages[this.messages.length-1];
    (lastServerActivityMessage.content as Activity).active = false;
  }

}
