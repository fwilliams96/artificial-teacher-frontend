import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  faPaperclip,
  faEllipsisV,
  faSearch,
  faMicrophone,
  faPaperPlane,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ListeningService } from '../../services/listening/listening.service';
import { DangerToastService } from 'src/app/shared/modules/toast/services/danger-toast/danger-toast.service';
import { Listening } from '../../interfaces/listening';
import { Sentence } from '../../interfaces/sentence';
import { SentenceWord } from '../../interfaces/sentence-word';
import { WritableSentenceWord } from '../../interfaces/writable-sentence-word';

@Component({
  selector: 'app-listening',
  templateUrl: './listening.component.html',
  styleUrls: ['./listening.component.scss']
})
export class ListeningComponent implements OnInit, AfterViewInit {

  faPaperclip = faPaperclip
  faEllipsisV = faEllipsisV
  faSearch = faSearch
  faMicrophone = faMicrophone
  faTrash = faTrash
  faPaperPlane = faPaperPlane

  listening: Listening | undefined = undefined
  currentSentenceIndex: number = 0;
  currentSentence: Sentence | undefined = undefined

  @ViewChild('audioListening') audioListening!: ElementRef;

  constructor(
    private readonly _chatService: ListeningService,
    private domSanitizer: DomSanitizer,
    private readonly _dangerToastService: DangerToastService
  ) {}

  ngAfterViewInit(): void {
    this.startListening();
  }

  ngOnInit(): void {
    
  }
  
  startListening() {

    this._chatService.startListening().subscribe(
      listening => {
        this.listening = listening;
        this.currentSentenceIndex = 0;
        this.initializeCurrentSentence();
      },
      err => {
        this._dangerToastService.show('Ha habido un error al crear el listening');
        console.log(err);
      }
    )
  }

  initializeCurrentSentence() {
    if (this.listening) {
      const currentSentence = this.listening.sentences[this.currentSentenceIndex];
      const blob = this.b64toBlob(currentSentence.audio, 'audio/mp4');
      currentSentence.safeUrl = this.sanitize(this.getURLFromBlob(blob));
      console.log(currentSentence.safeUrl);
      /*if (!currentSentence.audioBlob) {
        currentSentence.audioBlob = this.b64toBlob(currentSentence.audio, 'audio/mp4');
      }*/
      if (!currentSentence.answered) {
        currentSentence.words = this.initializeSentenceWords(currentSentence.words);
        currentSentence.answered = false;
      }

      this.currentSentence = currentSentence;
      if (this.audioListening) {
        this.audioListening.nativeElement.load();
      }
    }
  }

  initializeSentenceWords(words: SentenceWord[]): SentenceWord[] {
    return words.map(word => {
      if (word.writable) {
        return {
          ...word,
          userValue: ''
        };
      }
      return {...word};
    });

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

  checkCurrentSentence() {
    if (this.listening && this.currentSentence) {

      let anyWordWrong = false;

      this.currentSentence.words.forEach(word => {
        if (word.writable) {
          const writableWord = word as WritableSentenceWord;
          if (writableWord.value !== writableWord.userValue) {
            writableWord.wrong = true;
            anyWordWrong = true;
          }
        }
      });
      this.currentSentence.answered = true;

      // TODO call to update result with anyWordWrong


      /*this._chatService.checkSentence(
        this.listening.id, 
        this.currentSentenceIndex.toString(), 
        { words: this.currentSentence.words }
      ).subscribe(
        res => {
          if (this.currentSentence) {
            this.currentSentence.answered = true;  
          }
          if (res.correct) {
            alert("Frase correcta");
          }
          else {
            alert("Frase incorrecta");
          }
        },
        err => {
          console.log(err);
        }
      )*/
    }
  }

  goToPreviousSentence() {
    if (!this.isFirstPage()) {
      this.currentSentenceIndex -= 1;
      this.initializeCurrentSentence();
    }
  }

  goToNextSentence() {
    if (!this.isLastPage()) {
      this.currentSentenceIndex += 1;
      this.initializeCurrentSentence();
    }
  }

  isWritable(word: SentenceWord): word is WritableSentenceWord {
    return 'userValue' in word;
  }

  isFirstPage() {
    return this.currentSentenceIndex == 0;
  }

  isLastPage() {
    if (this.listening) {
      return this.currentSentenceIndex == ((this.listening.sentences.length - 1));
    }
    return false;
  }

}
