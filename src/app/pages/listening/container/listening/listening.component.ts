import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  faPaperclip,
  faEllipsisV,
  faSearch,
  faMicrophone,
  faPaperPlane,
  faTrash,
  faPlay,
  faPause
} from '@fortawesome/free-solid-svg-icons'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ListeningService } from '../../services/listening/listening.service';
import { DangerToastService } from 'src/app/shared/modules/toast/services/danger-toast/danger-toast.service';
import { Listening } from '../../interfaces/listening';
import { Sentence } from '../../interfaces/sentence';
import { SentenceWord } from '../../interfaces/sentence-word';
import { WritableSentenceWord } from '../../interfaces/writable-sentence-word';
import { InfoToastService } from 'src/app/shared/modules/toast/services/info-toast/info-toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-listening',
  templateUrl: './listening.component.html',
  styleUrls: ['./listening.component.scss']
})
export class ListeningComponent implements AfterViewInit {

  faPaperclip = faPaperclip
  faEllipsisV = faEllipsisV
  faSearch = faSearch
  faMicrophone = faMicrophone
  faTrash = faTrash
  faPaperPlane = faPaperPlane
  faPlay = faPlay
  faPause = faPause
  
  audioSrc: string | undefined = undefined;

  id_listening: string | null = null;

  listening: Listening | undefined = undefined

  currentSentenceIndex: number = 0;
  currentSentence: Sentence | undefined = undefined

  @ViewChild('audioListening') audioListening!: ElementRef;

  constructor(
    private readonly _listeningService: ListeningService,
    private domSanitizer: DomSanitizer,
    private readonly _infoToastService: InfoToastService,
    private readonly _dangerToastService: DangerToastService,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.recoverListening();
  }

  recoverListening() {

    this.id_listening = this.route.snapshot.paramMap.get('id');
    if (!this.id_listening) return;

    this._listeningService.getListening(this.id_listening).subscribe(
      listening => {
        this.listening = listening;
        this.currentSentenceIndex = 0;
        this.initializeCurrentSentence();
      },
      err => {
        this._dangerToastService.show('Ha habido un error al recuperar el listening');
        console.log(err);
      }
    )
  }

  initializeCurrentSentence() {
    if (this.listening) {
      const currentSentence = this.listening.sentences[this.currentSentenceIndex];
      const blob = this.b64toBlob(currentSentence.audio, 'audio/mp3');
      this.audioSrc = this.getURLFromBlob(blob);

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
      if (word.askable) {
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
        if (word.askable) {
          const writableWord = word as WritableSentenceWord;
          if (writableWord.word.toLowerCase() !== writableWord.userValue.toLowerCase()) {
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

  allSentencesWereChecked() {
    if (this.listening)
    for(let sentence of this.listening.sentences) {
      if (!sentence.answered) {
        return false;
      }
    }
    return true;
  }

  finishListening() {
    if (!this.listening) {
      return;
    }
    this.listening.finished = true;
    this._listeningService.finishListening(this.listening).subscribe(
      res => {
        this._router.navigate(['/home']);
        this._infoToastService.show('¡Has finalizado el listening!');
      },
      err => {
        console.log(err);
      }
    )
  }
  

}
