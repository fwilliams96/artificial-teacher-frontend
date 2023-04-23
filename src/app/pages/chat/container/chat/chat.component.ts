import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import {
  faPaperclip,
  faEllipsisV,
  faSearch,
  faMicrophone,
  faPaperPlane,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { ChatTextService } from '../../services/chat-text/chat-text.service';
import { Message, MessageType } from '../../interfaces/message';
import { Observable, from } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatVoiceService } from '../../services/chat-voice/chat-voice.service';
import { ChatService } from '../../services/chat/chat.service';
import { Context } from '../../interfaces/context';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewChecked {

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

  recording = false

  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  audioBlob: Blob | undefined = undefined;

  voiceEnabled = false

  constraints = {
    audio: false,
    video: true
  };

  url : string | undefined = undefined

  constructor(
    private readonly _chatTextService: ChatTextService,
    private readonly _chatVoiceService: ChatVoiceService,
    private readonly _chatService: ChatService,
    private domSanitizer: DomSanitizer
  ) {}

  ngAfterViewChecked() {
    this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
  }

  onKeyDown(event: Event) {
    event.preventDefault();
  }
  
  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
  }

  sendText() {
    // console.log(this.message)

    if (!this.contextId) {
      // TODO add something
      console.error("There is no contextId");
      return;
    }

    const message: Message = {
      content: this.message,
      type: MessageType.Sent
    };

    console.log("Sent message: ", message);

    if (this.voiceEnabled) {
      //this._chatTextService.sendTextAndReceiveVoice().
    }
    else {
      this._chatTextService.sendTextAndReceiveText(this.contextId, message).subscribe(
        res => {
          console.log("Received message: ", res)
          res.type = MessageType.Received
          this.addSentMessage(message)
          this.addReceivedMessage(res)
          this.message = ''
        },
        err => {
          console.log(err)
        }
      );
    }

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

  addSentMessage(message: Message) {
    this.messages.push(message)
  }

  addReceivedMessage(message: Message) {
    this.messages.push(message)
  }

  toggleRecording() {
    this.recording = !this.recording;
    if (this.recording) {
      this.startRecording();
    }
    else {
      this.stopRecording();
    }
  }

  startRecording() {
    this.deleteRecording();

    this.getMedia({audio: true}).subscribe(
      res => {
        this.mediaRecorder = new MediaRecorder(res)

        this.mediaRecorder.addEventListener("dataavailable", (event) => {
          console.log(event);
          this.audioChunks.push(event.data);
        });

        this.mediaRecorder.addEventListener("stop", async () => {
          this.audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
          this.url = URL.createObjectURL(this.audioBlob)
          console.log(this.audioBlob);
          console.log(this.url);
        });

        this.mediaRecorder.start();

      },
      err => {
        console.log(err);
      }
    )
  }

  getMedia(constraints: MediaStreamConstraints): Observable<any> {
      return from(navigator.mediaDevices.getUserMedia(constraints))
  }
  
  stopRecording() {
    this.mediaRecorder!.stream.getTracks().forEach( track => track.stop());
    this.mediaRecorder!.stop();
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  deleteRecording() {
    this.url = undefined;
    this.audioBlob = undefined;
    this.audioChunks = [];
  }

  sendRecording() {
    if (!this.contextId) {
      // TODO add something
      console.error("There is no contextId");
      return;
    }
    if (this.audioBlob) {

      /*this.blobToBase64(this.audioBlob).subscribe(
        res => {

        },
        err => {
          console.log(err);
        }
      )*/

      
      this._chatVoiceService.sendVoiceAndReceiveText(this.contextId, this.audioBlob).subscribe(
        res => {
          const sentMessage: Message = {
            content: res.transcription!,
            type: MessageType.Sent,
            urlAudioBlob: this.url
          };

          const receivedMessage: Message = {
            content: res.content,
            type: MessageType.Received
          };
      
          console.log("Sent message: ", sentMessage);
          console.log("Received message: ", receivedMessage)
          this.addSentMessage(sentMessage)
          this.addReceivedMessage(receivedMessage);
          this.deleteRecording();
        },
        err => {
          console.log(err);
          
        }
      )
    }
  }

  blobToBase64(blob: Blob): Observable<any> {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return from(new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    }));
  };

  startConversation() {

    const context: Context = {
      content: "Hello"
    }

    this._chatService.startConversation(context).subscribe(
      res => {
        this.contextId = res.context_id;
        
        const receivedMessage: Message = {
          content: res.content,
          type: MessageType.Received
        };

        this.addReceivedMessage(receivedMessage);
      },
      err => {
        console.log(err);
        
      }
    )
  }

}
